"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Detacher {
    constructor(pushController) {
        this.type = 'detach';
        this.keys = [];
        this.checked = false;
        this.pushController = pushController;
        this.collector = this.pushController.getCollectorController().getDetachCollector();
    }
    run() {
        if (!this.hasKeys()) {
            return;
        }
        this.processRelations();
        this.processTarget();
        let data = null;
        if (this.checked) {
            if (this.pushController.getInstanceData().getOrderByStatementController().has()) {
                data = this.pushController.getInstanceData().getOrderByStatementController().order(this.pushController.getData());
            }
            else {
                data = this.pushController.getInstanceData().getOrderByStatementController().orderDefault(this.pushController.getData());
            }
            this.pushController.setData(data);
        }
    }
    processTarget() {
        if (!this.pushController.getInstanceData().getWhereStatementController().hasWhereHas() &&
            !this.pushController.getInstanceData().getWhereStatementController().hasWhereDoesntHave()) {
            return;
        }
        const has_where_has = this.checkWhereHasByKeys(this.pushController.getInstanceData().getWhereStatementController());
        const has_where_doesnt_have = this.checkWhereDoesntHaveByKeys(this.pushController.getInstanceData().getWhereStatementController());
        // If non of the complicated Where has or where doesn't have statement have any of the keys we can return.
        if (!has_where_has && !has_where_doesnt_have) {
            return;
        }
        // We will check if we now have to EXCLUDE data according to the changed relations.
        if (has_where_has) {
            let data = this.pushController.getData();
            let filtered_data = this.pushController.getInstanceData().getWhereStatementController().filter(data);
            if (filtered_data.length !== data.length) {
                this.checked = true;
                this.pushController.setChecked();
                this.pushController.setData(filtered_data);
            }
        }
        // We will check if we have to now INCLUDE any of the changed data.
        if (has_where_doesnt_have) {
            let checked;
            let all_objects = this.pushController.getInstanceData().getObject().get();
            all_objects = this.pushController.getInstanceData().getWhereStatementController().filter(all_objects);
            if (!all_objects.length) {
                return;
            }
            let data = this.pushController.getData();
            if (data.length === all_objects.length) {
                return;
            }
            const pk = this.pushController.getInstanceData().getObject().getPrimaryKey();
            newLoop: for (const new_object of all_objects) {
                for (const old_object of data) {
                    if (new_object[pk] === old_object[pk]) {
                        continue newLoop;
                    }
                }
                checked = true;
                let new_model = this.pushController.getInstanceData().getObject().createModel(new_object);
                if (this.pushController.getInstanceData().getJoinStatementController().has()) {
                    // todo make it that statement can return joinStatementController
                    for (const nestedStatement of this.pushController.getInstanceData().getJoinStatementController().getStatements()) {
                        nestedStatement.attach(new_model);
                    }
                }
                data.push(new_model);
            }
            if (checked) {
                this.checked = true;
                this.pushController.setChecked();
                this.pushController.setData(data);
            }
        }
    }
    processRelations() {
        if (!this.pushController.getInstanceData().getJoinStatementController().has()) {
            return;
        }
        const statements = this.pushController.getInstanceData().getJoinStatementController().getStatements();
        let data = this.pushController.getData();
        let checked = false;
        let new_array = [];
        for (const statement of statements) {
            for (let object of data) {
                // If a relation doesn't contain any of the collector keys in either the joinStatement or whereStatement
                // we can continue;
                if (!this.relationHasKeys(statement)) {
                    continue;
                }
                const new_relation_data = this.checkRelationData(object, statement);
                if (new_relation_data !== false) {
                    let new_model = statement.getRelation().getLocalObject().createModel(object);
                    new_model[statement.getRelation().getObjectName()] = new_relation_data;
                    new_array.push(new_model);
                    checked = true;
                }
                else {
                    new_array.push(object);
                }
            }
        }
        if (checked) {
            this.checked = true;
            this.pushController.setChecked();
            this.pushController.setData(new_array);
        }
    }
    checkRelationData(object, statement) {
        return (object === null || !Array.isArray(object[statement.getRelation().getObjectName()]))
            ? this.checkRelationDataObject(object, statement)
            : this.checkRelationDataArray(object, statement);
    }
    checkRelationDataArray(object, statement) {
        let checked = false;
        let new_array = [];
        const has_where_has = (!statement.hasWhereStatements()) ? false :
            (this.checkWhereHasByKeys(statement.getWhereStatementController()));
        const has_where_doesnt_have = (!statement.hasWhereStatements()) ? false :
            (this.checkWhereDoesntHaveByKeys(statement.getWhereStatementController()));
        // We collect the ids that have to be removed from this relation array.
        const local_pk = statement.getRelation().getLocalObject().getPrimaryKey();
        const pk = statement.getRelation().getRelationObject().getPrimaryKey();
        let relation_ids_to_detach = this.collector.find(// todo type conflict later on.
        statement.getRelation().getLocalObject().getModelName(), object[local_pk], statement.getRelation().getModelName());
        if (relation_ids_to_detach) {
            if (statement.hasWhereStatements()) {
                let objects_to_detach = statement.getRelation().getRelationObject().find(relation_ids_to_detach);
                objects_to_detach = statement.getWhereStatementController().filter(objects_to_detach);
                relation_ids_to_detach = objects_to_detach.map((obj) => obj[pk]);
            }
        }
        for (let relationObject of object[statement.getRelation().getObjectName()]) {
            // We check if the object should now be EXCLUDED because it has a where has statement.
            if (has_where_has) {
                if (!statement.getWhereStatementController().check(relationObject)) {
                    checked = true;
                    continue;
                }
            }
            // Exclude the relationObject if it is in the array with ids to remove.
            if (relation_ids_to_detach.includes(relationObject[pk])) {
                checked = true;
                continue;
            }
            // We check the nested relations if any.
            let new_model = null;
            // We check the nested relations.
            if (statement.hasStatements()) {
                const relationStatements = statement.getStatements();
                for (const relationStatement of relationStatements) {
                    // If a relation doesn't contain any of the collector keys in either the joinStatement or
                    // whereStatement we can continue.
                    if (!this.relationHasKeys(relationStatement)) {
                        continue;
                    }
                    const new_relation_data = this.checkRelationData(relationObject, relationStatement);
                    if (new_relation_data !== false) {
                        if (!new_model) {
                            new_model = relationStatement.getRelation().getLocalObject().createModel(relationObject);
                        }
                        new_model[relationStatement.getRelation().getObjectName()] = new_relation_data;
                    }
                }
            }
            if (new_model) {
                checked = true;
                new_array.push(new_model);
            }
            else {
                new_array.push(relationObject);
            }
        }
        // We check if the relation has a where doesn't have statement that might now INCLUDE new relations.
        if (has_where_doesnt_have) {
            const all_relations = statement.getRelation().findByObject(object);
            const filtered_all_relations = statement.getWhereStatementController().filter(all_relations);
            // If both arrays have the same length we are done.
            if (filtered_all_relations.length !== new_array.length) {
                relationLoop: for (const relation of filtered_all_relations) {
                    for (const included_object of new_array) {
                        if (relation[pk] !== included_object[pk]) {
                            continue relationLoop;
                        }
                        checked = true;
                        let new_model = statement.getRelation().getRelationObject().createModel(relation);
                        if (statement.hasStatements()) {
                            // todo make it that statement can return joinStatementController
                            for (const nestedStatement of statement.getStatements()) {
                                nestedStatement.attach(new_model);
                            }
                        }
                        new_array.push(new_model);
                    }
                }
            }
        }
        return (checked)
            ? new_array
            : false;
    }
    checkRelationDataObject(object, statement) {
        let relationObject = object[statement.getRelation().getObjectName()];
        const local_pk = statement.getRelation().getRelationObject().getPrimaryKey();
        if (relationObject) {
            // we check if the collector has any ids
            let relation_ids_to_detach = this.collector.find(// todo type conflict later on.
            statement.getRelation().getLocalObject().getModelName(), object[local_pk], statement.getRelation().getModelName());
            // It's a single relation if there is a result it needs to be detached
            if (relation_ids_to_detach) {
                return null;
            }
            // We check if the object should now be EXCLUDED because it has a where has statement.
            if (statement.hasWhereStatements() && this.checkWhereHasByKeys(statement.getWhereStatementController())) {
                if (!statement.getWhereStatementController().check(relationObject)) {
                    return null;
                }
            }
            // We check the nested relations if any.
            let new_model = null;
            // We check the nested relations.
            if (statement.hasStatements()) {
                const relationStatements = statement.getStatements();
                for (const relationStatement of relationStatements) {
                    // If a relation doesn't contain any of the collector keys in either the joinStatement or
                    // whereStatement we can continue.
                    if (!this.relationHasKeys(relationStatement)) {
                        continue;
                    }
                    const new_relation_data = this.checkRelationData(relationObject, relationStatement);
                    if (new_relation_data !== false) {
                        if (!new_model) {
                            new_model = relationStatement.getRelation().getLocalObject().createModel(relationObject);
                        }
                        new_model[relationStatement.getRelation().getObjectName()] = new_relation_data;
                    }
                }
            }
            return (new_model)
                ? new_model
                : false;
        }
        if (!relationObject) {
            // we check if there was a nested where doesnt have statement that might now INCLUDE a relation
            if (statement.hasWhereStatements() && this.checkWhereDoesntHaveByKeys(statement.getWhereStatementController())) {
                let all_relation_objects = statement.getRelation().findByObject(object);
                if (all_relation_objects) {
                    if (statement.getWhereStatementController().check(all_relation_objects)) {
                        let new_model = statement.getRelation().getRelationObject().createModel(all_relation_objects);
                        if (statement.hasStatements()) {
                            const nested_statements = statement.getStatements();
                            for (const nested_statement of nested_statements) {
                                nested_statement.attach(new_model);
                            }
                        }
                        return new_model;
                    }
                }
            }
            return false;
        }
    }
    relationHasKeys(statement) {
        for (const key of this.collector.keys()) {
            if (statement.has(key)) {
                return true;
            }
        }
        return false;
    }
    hasKeys() {
        for (const key of this.collector.keys()) {
            if (this.pushController.getInstanceData().has(key)) {
                this.keys.push(key);
            }
        }
        return !!(this.keys.length);
    }
    checkWhereHasByKeys(controller) {
        for (const key of this.keys) {
            if (controller.hasWhereHas(key)) {
                return true;
            }
        }
        return false;
    }
    checkWhereDoesntHaveByKeys(controller) {
        for (const key of this.keys) {
            if (controller.hasWhereDoesntHave(key)) {
                return true;
            }
        }
        return false;
    }
}
exports.Detacher = Detacher;
