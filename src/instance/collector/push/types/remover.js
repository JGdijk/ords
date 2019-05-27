"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Remover {
    constructor(pushController) {
        this.type = 'remove';
        this.keys = [];
        this.checked = false;
        this.pushController = pushController;
        this.collector = this.pushController.getCollectorController().getRemoveCollector();
    }
    run() {
        if (!this.hasKeys()) {
            return;
        }
        this.processTarget();
        this.processRelations();
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
        const key = this.pushController.getInstanceData().getObject().getModelName();
        // if the collector doesn't contain any target data we can skip
        if (!this.collector.has(key)) {
            return;
        }
        let ids = this.collector.find(key);
        // filter out all the objects if ids are set
        if (this.pushController.getInstanceData().hasIds()) {
            ids = this.filterIds(ids);
        }
        if (!ids.length) {
            return;
        }
        let check = false;
        const pk = this.pushController.getInstanceData().getObject().getPrimaryKey();
        const new_data = this.pushController.getData().filter((obj) => {
            for (const id of ids) {
                if (id === obj[pk]) {
                    check = true;
                    return false;
                }
            }
            return true;
        });
        if (check) {
            this.checked = true;
            this.pushController.setChecked();
            this.pushController.setData(new_data);
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
                const new_relation_data = this.checkRelationData(object[statement.getRelation().getObjectName()], statement);
                if (new_relation_data !== false) {
                    let new_object = Object.assign({}, object);
                    new_object[statement.getRelation().getObjectName()] = new_relation_data;
                    new_array.push(new_object);
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
        if ((!statement.getRelation().returnsMany() && !object) ||
            statement.getRelation().returnsMany() && (!object || !object.length)) {
            return false;
        }
        return (Array.isArray(object))
            ? this.checkRelationDataArray(object, statement)
            : this.checkRelationDataObject(object, statement);
    }
    checkRelationDataArray(objects, statement) {
        // todo if something is removed we have to check if a where has is still valid
        // todo or that a where doesn't have became valid.
        let ids_to_remove = this.collector.find(statement.getRelation().getModelName());
        let checked = false;
        const pk = statement.getRelation().getRelationObject().getPrimaryKey();
        let new_relation_array = [];
        for (const object of objects) {
            if (ids_to_remove.includes(object[pk])) {
                checked = true;
                continue;
            }
            let new_object = null;
            let relation_checked = false;
            if (statement.hasStatements()) {
                const relationStatements = statement.getStatements();
                for (const relationStatement of relationStatements) {
                    const new_relation_data = this.checkRelationData(object[relationStatement.getRelation().getObjectName()], relationStatement);
                    if (new_relation_data !== false) {
                        if (!new_object) {
                            new_object = Object.assign({}, object);
                        }
                        new_object[relationStatement.getRelation().getObjectName()] = new_relation_data;
                        checked = true;
                    }
                }
            }
            if (relation_checked) {
                checked = true;
                new_relation_array.push(new_object);
            }
            else {
                new_relation_array.push(object);
            }
        }
        if (checked) {
            this.checked = true;
            this.pushController.setChecked();
            return new_relation_array;
        }
        else {
            return false;
        }
    }
    checkRelationDataObject(object, statement) {
        let ids_to_remove = this.collector.find(statement.getRelation().getModelName());
        const pk = statement.getRelation().getRelationObject().getPrimaryKey();
        if (ids_to_remove.includes(object[pk])) {
            this.checked = true;
            this.pushController.setChecked();
            return null;
        }
        if (!statement.hasStatements()) {
            return false;
        }
        let relation_checked = false;
        let new_object = null;
        const relationStatements = statement.getStatements();
        for (const relationStatement of relationStatements) {
            const new_relation_data = this.checkRelationData(object[relationStatement.getRelation().getObjectName()], relationStatement);
            if (new_relation_data === false) {
                continue;
            }
            if (!new_object) {
                new_object = Object.assign({}, object);
            }
            new_object[relationStatement.getRelation().getObjectName()] = new_relation_data;
            relation_checked = true;
        }
        return (relation_checked)
            ? new_object
            : false;
    }
    hasKeys() {
        for (const key of this.collector.keys()) {
            if (this.pushController.getInstanceData().has(key)) {
                this.keys.push(key);
            }
        }
        return !!(this.keys.length);
    }
    filterIds(ids) {
        return ids.filter((remove_id) => {
            for (const id of this.pushController.getInstanceData().getIds()) {
                if (id === remove_id) {
                    return true;
                }
            }
            return false;
        });
    }
}
exports.Remover = Remover;
