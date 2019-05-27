"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const where_has_statement_callback_1 = require("./where-has-statement-callback");
const where_statement_controller_1 = require("../../../where-statement-controller");
class WhereHasStatementCallbackStatement {
    constructor(relation, callback) {
        this.relation = relation;
        this.whereStatementController = new where_statement_controller_1.WhereStatementController(this.getRelation().getRelationObject());
        this.processCallback(callback);
    }
    has(key) {
        if (this.relation.getRelationObject().getModelName() === key) {
            return true;
        }
        return this.whereStatementController.has(key);
    }
    hasWhereHas(key) {
        if (!key) {
            return true;
        }
        if (key === this.relation.getModelName()) {
            return true;
        }
        return this.whereStatementController.has(key);
    }
    hasWhereHasComplicated(key) {
        if (key === this.relation.getModelName()) {
            return true;
        }
        return this.whereStatementController.has(key);
    }
    hasWhereDoesntHave(key) {
        return this.getWhereStatementController().hasWhereDoesntHave(key);
    }
    hasWhereDoesntHaveComplicated(key) {
        return this.getWhereStatementController().hasWhereDoesntHaveComplicated(key);
    }
    check(object) {
        //todo maybe better primary key check / error?
        const primary_key = this.relation.getLocalObject().getPrimaryKey();
        if (!object.hasOwnProperty(primary_key)) {
            return false;
        }
        if (!this.relation.has(object[primary_key])) {
            return false;
        }
        let relation = this.relation.findByObject(object);
        if (this.relation.returnsMany()) {
            relation = this.whereStatementController.filter(relation);
            return (relation.length > 0);
        }
        else {
            return this.whereStatementController.check(relation);
        }
    }
    filter(objects) {
        return objects.filter((object) => {
            return this.check(object);
        });
    }
    getWhereStatementController() {
        return this.whereStatementController;
    }
    getRelation() {
        return this.relation;
    }
    processCallback(callback) {
        new where_has_statement_callback_1.WhereHasStatementCallback(this, callback);
    }
}
exports.WhereHasStatementCallbackStatement = WhereHasStatementCallbackStatement;
