import {PushController} from "../push-controller";
import {UpdateCollector} from "../../types/update-collector";
import {JoinStatementInterface} from "../../../statements/join/join-statement-interface";
import {WhereStatementController} from "../../../statements/where/where-statement-controller";

export class Updater {

    protected type: string;

    private keys: string[];

    private pushController: PushController;

    private collector: UpdateCollector;

    private checked: boolean;

    constructor(pushController: PushController) {
        this.type = 'update';
        this.keys = [];
        this.checked = false;

        this.pushController = pushController;
        this.collector = this.pushController.getCollectorController().getUpdateCollector();
    }

    public run() {
        if (!this.hasKeys()) { return; }

        this.processTarget();

        this.processRelations();

        let data = null;

        if (this.checked) {
            if (this.pushController.getInstanceData().getOrderByStatementController().has()) {
                data = this.pushController.getInstanceData().getOrderByStatementController().order(this.pushController.getData());
            } else {
                data = this.pushController.getInstanceData().getOrderByStatementController().orderDefault(this.pushController.getData());
            }

            this.pushController.setData(data);
        }
    }

    private processTarget(): void {
        const key = this.pushController.getInstanceData().getObject().getModelName();
        let checked = false;

        // We filter out the updated data according the the where statements.
        // todo check for ids?
        let updated_data = this.collector.find(key);
        if (this.pushController.getInstanceData().getWhereStatementController().has(key)) {
            const new_updated_data = this.pushController.getInstanceData().getWhereStatementController().filter(updated_data);
            if (updated_data.length !== new_updated_data.length) { checked = true; }
            updated_data = new_updated_data;
        }


        // We filter out the original data according to the where statements.
        let old_data = this.pushController.getData();

        // todo remove this we only check on the target key, but we don't know if there are nested where has statements
        // todo so we have to check if the wereController has any key that is presented in the collector.
        // if (this.pushController.getInstanceData().getWhereStatementController().has(key)) {
            const new_old_data = this.pushController.getInstanceData().getWhereStatementController().filter(old_data);
            if (old_data.length !== new_old_data.length) { checked = true; }
            old_data = new_old_data;
        // }

        const pk = this.pushController.getInstanceData().getObject().getPrimaryKey();

        let objects_to_push = [];

        // We loop over the updated objects, if they are present we update them, if not we add them.
        updateLoop: for (const updated_object of updated_data) {
            for (const old_object of old_data) {
                if (old_object[pk] !== updated_object[pk]) { continue; }

                // We know that the updated object passed the whereCheck, we know the object can stay in the
                // array.
                let new_object = Object.assign(this.pushController.getInstanceData().getObject().createModel(), old_object);
                objects_to_push.push(Object.assign(new_object, updated_object));
                checked = true;
                continue updateLoop;
            }

            let new_model = this.pushController.getInstanceData().getObject().createModel(updated_object);

            // If the updated object wasn't in the array before, we can now push it.
            if (this.pushController.getInstanceData().getJoinStatementController().has()) {
                this.pushController.getInstanceData().getJoinStatementController().attach(new_model)
            }

            objects_to_push.push(new_model);
        }

        // We have to include all the original objects that haven't been updated.
        oldLoop: for (const old_object of old_data) {
            for (const obj of objects_to_push) {
                if (old_object[pk] === obj[pk]) { continue oldLoop }
            }
            objects_to_push.push(old_object);
        }

        // There might be objects with complicated whereHas or whereDoesntHave statements that will now be INCLUDED.
        if (this.pushController.getInstanceData().getWhereStatementController().has() &&
            this.complicated(this.pushController.getInstanceData().getWhereStatementController())) {

            let all_objects = this.pushController.getInstanceData().getObject().get();
            all_objects = this.pushController.getInstanceData().getWhereStatementController().filter(all_objects);

            outerLoop: for (const object of all_objects) {
                for (const new_object of objects_to_push) {
                    if (object[pk] === new_object[pk]) { continue outerLoop;}
                }

                let new_model = this.pushController.getInstanceData().getObject().createModel(object);

                if (this.pushController.getInstanceData().getJoinStatementController().has()) {
                    this.pushController.getInstanceData().getJoinStatementController().attach(new_model)
                }

                checked = true;
                objects_to_push.push(new_model);
            }
        }

        if (checked) {
            this.pushController.setChecked();
            this.checked = true;
            this.pushController.setData(objects_to_push);
        }
    }

    private processRelations(): void {
        if (!this.pushController.getInstanceData().getJoinStatementController().has()) { return; }

        const statements = this.pushController.getInstanceData().getJoinStatementController().getStatements();

        let data = this.pushController.getData();

        let checked = false;
        let new_array = [];

        for (const statement of statements) {
            for (let object of data) {

                // If a relation doesn't contain any of the collector keys in either the joinStatement or whereStatement
                // we can continue;
                if (!this.relationHasKeys(statement)) { continue; }

                const new_relation_data =
                    this.checkRelationData(object, statement);
                if (new_relation_data !== false) {
                    let new_model = Object.assign(this.pushController.getInstanceData().getObject().createModel(), object);
                    new_model[statement.getRelation().getObjectName()] = new_relation_data;
                    new_array.push(new_model);

                    checked = true;
                } else {
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

    private checkRelationData(object: any, statement: JoinStatementInterface): any | boolean {
        // Get all the objects from the collector here so when there are extensive where statements we only have to
        // filter them once.
        let objects_to_update = this.collector.find(statement.getRelation().getModelName());
        if (statement.hasWhereStatements()) {
            objects_to_update = statement.getWhereStatementController().filter(objects_to_update);
        }

        return (object === null || !Array.isArray(object[statement.getRelation().getObjectName()]))
            ? this.checkRelationDataObject(object, statement, objects_to_update)
            : this.checkRelationDataArray(object, statement, objects_to_update);
    }

    // if the relation is an array
    private checkRelationDataArray(object: any, statement: JoinStatementInterface, objects_to_update: any[]): any[] | boolean {

        // if the relation array is empty and there are no relations available for this object we can return;
        if (!object[statement.getRelation().getObjectName()].length) {
            if (!statement.getRelation().hasByObject(object)){ return false; }
        }

        let checked = false;

        const pk = statement.getRelation().getRelationObject().getPrimaryKey();
        let new_array = [];

        for (const relationObject of object[statement.getRelation().getObjectName()]) {

            let new_model = null;

            // We check if a relation object needs to update its core data.
            for (const updated_object of objects_to_update) {
                if (updated_object[pk] !== relationObject[pk]) { continue; }

                new_model = Object.assign(statement.getRelation().getRelationObject().createModel(), relationObject);
                new_model = Object.assign(new_model, updated_object);
                break;
            }

            // If the statement has a whereHas or whereDoesn't have statement with extra conditions, we have to check
            // if the object will now be EXCLUDED.
            if (!new_model && statement.hasWhereStatements() && this.hasWhereHasorDoesntHaveByKeysComplicated(statement)) {
                if (!statement.getWhereStatementController().check(relationObject)) {
                    checked = true;
                    continue;
                }
            }

            // we check the nested relations
            if (statement.hasStatements()) {
                const relationStatements = statement.getStatements();
                for (const relationStatement of relationStatements) {

                    // If a relation doesn't contain any of the collector keys in either the joinStatement or whereStatement
                    // we can continue;
                    if (!this.relationHasKeys(relationStatement)) { continue; }

                    const new_relation_data =
                        this.checkRelationData(relationObject, relationStatement);
                    if (new_relation_data !== false) {
                        new_model = Object.assign(statement.getRelation().getRelationObject().createModel(), relationObject);
                        new_model[relationStatement.getRelation().getObjectName()] = new_relation_data;
                    }
                }
            }

            if (new_model) {
                checked = true;
                new_array.push(new_model);
            } else {
                new_array.push(relationObject);
            }
        }


        // If a whereHas or whereDoesntHave has extra conditions, a relation object might now be INCLUDED because
        // of the update. Because this relation object was previously not attached we have check for it.
        if (statement.hasWhereStatements() && this.hasWhereHasorDoesntHaveByKeysComplicated(statement)) {

            let all_relation_objects = statement.getRelation().findByObject(object);
            if (statement.hasWhereStatements()) {
                all_relation_objects = statement.getWhereStatementController().filter(all_relation_objects);
            }

            // If the amount of relations that should be attached is the same as the amount of relations that will be
            // attached, we can skip comparing them.
            if (all_relation_objects.length !== new_array.length) {
                relationLoop: for (let relationObject of all_relation_objects) {
                    for (const object of new_array) {
                        if (object[pk] === relationObject[pk]) { continue relationLoop; }

                        checked = true;
                        let new_model = statement.getRelation().getRelationObject().createModel(relationObject);
                        statement.attach(new_model);
                        new_array.push(new_model);
                    }
                }
            }
        }

        if (!checked) { return false; }

        return (statement.hasOrderByStatements())
            ? statement.getOrderByStatementController().order(new_array)
            : statement.getOrderByStatementController().orderDefault(new_array);
    }

    // if the relation is an object
    private checkRelationDataObject(object: any, statement: JoinStatementInterface, objects_to_update: any[]): any | boolean {

        let new_model = null;
        let relationObject = object[statement.getRelation().getObjectName()];

        if (relationObject) {

            const pk = statement.getRelation().getRelationObject().getPrimaryKey();

            // We check if a relation object needs to update its core data.
            for (let object_to_update of objects_to_update) {
                if (relationObject[pk] !== object_to_update[pk]) { continue; }

                new_model = Object.assign(statement.getRelation().getRelationObject().createModel(), relationObject);
                new_model = Object.assign(new_model, object_to_update);
            }

            // If the statement has a whereHas or whereDoesn't have statement with extra conditions, we have to check
            // if the object will now be EXCLUDED.
            if (!new_model && statement.hasWhereStatements() && this.hasWhereHasorDoesntHaveByKeysComplicated(statement)) {
                if (!statement.getWhereStatementController().check(relationObject)) { return null; }
            }

            if (statement.hasStatements()) {
                const relationStatements = statement.getStatements();
                for (const relationStatement of relationStatements) {

                    // If a relation doesn't contain any of the collector keys in either the joinStatement or whereStatement
                    // we can continue;
                    if (!this.relationHasKeys(relationStatement)) { continue; }

                    const new_relation_data =
                        this.checkRelationData(relationObject, relationStatement);
                    if (new_relation_data !== false) {
                        if (!new_model) {
                            new_model = Object.assign(statement.getRelation().getRelationObject().createModel(), relationObject);
                        }
                        new_model[relationStatement.getRelation().getObjectName()] = new_relation_data;
                    }
                }
            }
        }

        // If a whereHas or whereDoesntHave has extra conditions, a relation object might now be INCLUDED because
        // of the update. Because this relation object was previously not attached we have check for it.
        if (!relationObject && !new_model && statement.hasWhereStatements() && this.hasWhereHasorDoesntHaveByKeysComplicated(statement)) {

            let new_relationObject = statement.getRelation().findByObject(relationObject);

            let check = false;
            if (statement.hasWhereStatements()) {
                check = statement.getWhereStatementController().check(new_relationObject);
            }

            if (new_relationObject && check) {
                let new_model = statement.getRelation().getRelationObject().createModel(new_relationObject);
                statement.attach(new_model);
            }
        }

        return (new_model)
            ? new_model
            : false;
    }


    private hasKeys(): boolean {
        for (const key of this.collector.keys()) {
            if (this.pushController.getInstanceData().has(key)) {
                this.keys.push(key);
            }
        }

        return !!(this.keys.length);
    }

    private hasWhereHasorDoesntHaveByKeys(statement: JoinStatementInterface): boolean {
        if (!statement.hasWhereStatements()) { return false; }

        for (const key of this.collector.keys()) {
            if (statement.getWhereStatementController().hasWhereHas(key)) { return true; }
            if (statement.getWhereStatementController().hasWhereDoesntHave(key)) { return true; }
        }
        return false;
    }

    // todo check if this works
    private hasWhereHasorDoesntHaveByKeysComplicated(statement: JoinStatementInterface): boolean {
        if (!statement.hasWhereStatements()) { return false; }

        for (const key of this.collector.keys()) {
            if (statement.getWhereStatementController().hasWhereHasComplicated(key)) { return true; }
            if (statement.getWhereStatementController().hasWhereDoesntHaveComplicated(key)) { return true; }
        }
        return false;
    }

    private complicated(statement: WhereStatementController): boolean {
        for (const key of this.collector.keys()) {
            if (statement.hasWhereHasComplicated(key)) { return true; }
            if (statement.hasWhereDoesntHaveComplicated(key)) { return true; }
        }
        return false;
    }

    private relationHasKeys(statement: JoinStatementInterface): boolean {
        for (const key of this.collector.keys()) {
            if (statement.has(key)) { return true; }
        }
        return false;
    }

}