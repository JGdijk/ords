"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Adder {
    constructor(pushController) {
        this.type = 'add';
        this.keys = [];
        this.checked = false;
        this.pushController = pushController;
        this.collector = this.pushController.getCollectorController().getAddCollector();
    }
    run() {
        if (!this.hasKeys()) {
            return;
        }
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
        const key = this.pushController.getInstanceData().getObject().getModelName();
        // if the collector doesn't contain any target data we can skip
        if (!this.collector.has(key)) {
            return;
        }
        let data = this.collector.find(key);
        // filter out all the objects if ids are set
        if (this.pushController.getInstanceData().hasIds()) {
            data = this.filterIds(data);
        }
        // filter on where conditions
        if (this.pushController.getInstanceData().getWhereStatementController().has()) {
            data = this.pushController.getInstanceData().getWhereStatementController().filter(data);
        }
        if (!data.length) {
            return;
        }
        // by now we know we are going to add things.
        this.pushController.setChecked();
        this.checked = true;
        // todo we might want to build a system where the to add items are seperatly stored so when we check upon
        // todo the relations we don't double check the newly added items.
        // we create models out of the objects that have to be added
        let new_models = [];
        for (const obj of data) {
            new_models.push(this.pushController.getInstanceData().getObject().createModel(obj));
        }
        // check if relations needs to be attached.
        if (this.pushController.getInstanceData().getJoinStatementController().has()) {
            this.pushController.getInstanceData().getJoinStatementController().attachMany(new_models);
        }
        // add the objects
        var new_data = this.pushController.getData();
        for (const object of new_models) {
            new_data.push(object);
        }
        this.pushController.setData(new_data);
    }
    filterIds(data) {
        const primary_key = this.pushController.getInstanceData().getObject().getPrimaryKey();
        return data.filter((obj) => {
            for (const id of this.pushController.getInstanceData().getIds()) {
                if (id === obj[primary_key]) {
                    return true;
                }
            }
            return false;
        });
    }
    hasKeys() {
        for (const key of this.collector.keys()) {
            if (this.pushController.getInstanceData().has(key)) {
                this.keys.push(key);
            }
        }
        return !!(this.keys.length);
    }
}
exports.Adder = Adder;
