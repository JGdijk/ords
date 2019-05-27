"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const where_doesnt_have_statement_callback_1 = require("./where-doesnt-have-statement-callback");
const where_statement_controller_1 = require("../../../where-statement-controller");
class WhereDoesntHaveStatementCallbackStatement {
    constructor(relation, callback) {
        this.relation = relation;
        this.whereStatementController = new where_statement_controller_1.WhereStatementController(this.getRelation().getRelationObject());
        this.processCallback(callback);
    }
    has(key) {
        if (this.relation.getModelName() === key) {
            return true;
        }
        return !!(this.getWhereStatementController().has(key));
    }
    hasWhereHas(key) {
        return this.getWhereStatementController().hasWhereHas(key);
    }
    hasWhereHasComplicated(key) {
        return this.getWhereStatementController().hasWhereHasComplicated(key);
    }
    hasWhereDoesntHave(key) {
        if (!key) {
            return true;
        }
        if (key === this.relation.getModelName()) {
            return true;
        }
        return this.whereStatementController.has(key);
    }
    hasWhereDoesntHaveComplicated(key) {
        if (key === this.relation.getModelName()) {
            return true;
        }
        return this.whereStatementController.has(key);
    }
    check(object) {
        //todo maybe better primary key check / error?
        const primary_key = this.relation.getLocalObject().getPrimaryKey();
        if (!object.hasOwnProperty(primary_key)) {
            return false;
        }
        if (!this.relation.has(object[primary_key])) {
            return true;
        }
        let relation = this.relation.findByObject(object);
        if (this.relation.returnsMany()) {
            relation = this.whereStatementController.filter(relation);
            return (relation.length === 0);
        }
        else {
            return !this.whereStatementController.check(relation);
        }
    }
    filter(objects) {
        return objects.filter((objects) => {
            return this.check(objects);
        });
    }
    getRelation() {
        return this.relation;
    }
    getWhereStatementController() {
        return this.whereStatementController;
    }
    processCallback(callback) {
        new where_doesnt_have_statement_callback_1.WhereDoesntHaveStatementCallback(this, callback);
    }
}
exports.WhereDoesntHaveStatementCallbackStatement = WhereDoesntHaveStatementCallbackStatement;
