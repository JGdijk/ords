"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const where_statement_controller_1 = require("../../../where/where-statement-controller");
const order_by_statement_controller_1 = require("../../../orderby/order-by-statement-controller");
const join_statement_controller_1 = require("../../join-statement-controller");
const join_callback_1 = require("./join-callback");
class JoinCallbackStatement {
    constructor(relation, callback) {
        this.relation = relation;
        this.orderByStatementController = new order_by_statement_controller_1.OrderByStatementController(relation.getRelationObject().getPrimaryKey());
        this.joinStatementController = new join_statement_controller_1.JoinStatementController();
        this.whereStatementController = new where_statement_controller_1.WhereStatementController(this.relation.getRelationObject());
        this.processCallback(callback);
    }
    attach(object) {
        let relation_objects = this.relation.findByObject(object);
        // Returns if null or []
        if (!relation_objects || !relation_objects.length) {
            object[this.relation.getObjectName()] = relation_objects;
            return;
        }
        if (!this.relation.returnsMany()) {
            // If the relation doesn't pass the where statement return null.
            if (this.whereStatementController.has() && !this.getWhereStatementController().check(relation_objects)) {
                object[this.relation.getObjectName()] = null;
                return;
            }
            let model = this.relation.getRelationObject().createModel(relation_objects);
            if (this.getJoinStatementController().has()) {
                this.getJoinStatementController().attach(model);
            }
            object[this.relation.getObjectName()] = model;
            return;
        }
        else {
            if (this.whereStatementController.has()) {
                relation_objects = this.getWhereStatementController().filter(relation_objects);
            }
            let models = [];
            for (const obj of relation_objects) {
                models.push(this.relation.getRelationObject().createModel(obj));
            }
            if (this.orderByStatementController.has()) {
                models = this.getOrderByStatementController().order(models);
            }
            if (this.getJoinStatementController().has()) {
                this.getJoinStatementController().attachMany(models);
            }
            object[this.relation.getObjectName()] = models;
            return;
        }
    }
    has(key) {
        if (key === this.getRelation().getModelName()) {
            return true;
        }
        if (this.getJoinStatementController().has(key)) {
            return true;
        }
        return !!(this.getWhereStatementController().has(key));
    }
    hasStatements(key) {
        return !!(this.getJoinStatementController().has());
    }
    getStatements() {
        return this.getJoinStatementController().getStatements();
    }
    processCallback(callback) {
        new join_callback_1.JoinCallback(this, callback);
    }
    hasWhereStatements() {
        return this.getWhereStatementController().has();
    }
    hasOrderByStatements() {
        return this.getOrderByStatementController().has();
    }
    getOrderByStatementController() {
        return this.orderByStatementController;
    }
    getJoinStatementController() {
        return this.joinStatementController;
    }
    getWhereStatementController() {
        return this.whereStatementController;
    }
    getRelation() {
        return this.relation;
    }
}
exports.JoinCallbackStatement = JoinCallbackStatement;
