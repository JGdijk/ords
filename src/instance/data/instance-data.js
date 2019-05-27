"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const where_statement_controller_1 = require("../statements/where/where-statement-controller");
const order_by_statement_controller_1 = require("../statements/orderby/order-by-statement-controller");
const join_statement_controller_1 = require("../statements/join/join-statement-controller");
class InstanceData {
    constructor(object) {
        this.object = object;
        this.whereStatementController = new where_statement_controller_1.WhereStatementController(this.object);
        this.orderByStatementController = new order_by_statement_controller_1.OrderByStatementController(this.object.getPrimaryKey());
        this.joinStatementController = new join_statement_controller_1.JoinStatementController();
        this.initiated = false;
        this.data = [];
        this.ids = [];
    }
    getIds() {
        return this.ids;
    }
    hasIds() {
        return !!(this.ids.length);
    }
    setIds(ids) {
        if (!ids) {
            return;
        }
        if (!Array.isArray(ids)) {
            const array = [];
            array.push(ids);
            ids = array;
        }
        this.ids = ids;
    }
    set(data) {
        this.data = data;
    }
    get() {
        return (this.initiated)
            ? this.data
            : this.init();
    }
    getDataIds() {
        const data = this.get();
        let ids = [];
        for (const obj of data) {
            ids.push(obj[this.object.getPrimaryKey()]);
        }
        return ids;
    }
    first() {
        return this.get()[0];
    }
    getWhereStatementController() {
        return this.whereStatementController;
    }
    getOrderByStatementController() {
        return this.orderByStatementController;
    }
    getJoinStatementController() {
        return this.joinStatementController;
    }
    getObject() {
        return this.object;
    }
    has(key) {
        if (this.getObject().getModelName() === key) {
            return true;
        }
        if (this.whereStatementController.has(key)) {
            return true;
        }
        return (this.joinStatementController.has(key));
    }
    init() {
        let data = (this.hasIds())
            ? this.object.find(this.ids)
            : this.object.get();
        if (this.whereStatementController.has()) {
            data = this.getWhereStatementController().filter(data);
        }
        let models = [];
        for (const obj of data) {
            models.push(this.getObject().createModel(obj));
        }
        if (this.orderByStatementController.has()) {
            models = this.getOrderByStatementController().order(models);
        }
        else {
            models = this.getOrderByStatementController().orderDefault(models);
        }
        if (this.getJoinStatementController().has()) {
            this.getJoinStatementController().attachMany(models);
        }
        this.data = models;
        this.initiated = true;
        return this.data;
    }
}
exports.InstanceData = InstanceData;
