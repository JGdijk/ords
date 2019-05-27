"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const where_statement_controller_1 = require("../../../where-statement-controller");
const where_all_have_statement_callback_1 = require("./where-all-have-statement-callback");
class WhereAllHaveStatementCallbackStatement {
    constructor(relation, callback) {
        this.relation = relation;
        this.whereStatementController = new where_statement_controller_1.WhereStatementController(this.getRelation().getRelationObject());
        this.processCallback(callback);
    }
    check(object) {
        let relationObjects = this.relation.findByObject(object);
        if (this.relation.returnsMany()) {
            if (!relationObjects.length) {
                return false;
            }
            const filtered_RelationObjects = this.whereStatementController.filter(relationObjects);
            if (!filtered_RelationObjects.length) {
                return false;
            }
        }
        else {
            if (!relationObjects) {
                return false;
            }
            if (!this.whereStatementController.check(relationObjects)) {
                return false;
            }
        }
        return true;
    }
    filter(objects) {
        for (const object of objects) {
            if (!this.check(object)) {
                return [];
            }
        }
        return objects;
    }
    has(key) {
        if (this.relation.getRelationObject().getModelName() === key) {
            return true;
        }
        return this.whereStatementController.has(key);
    }
    hasWhereHas(key) {
        return this.whereStatementController.hasWhereHas(key);
    }
    hasWhereHasComplicated(key) {
        return this.whereStatementController.hasWhereHasComplicated(key);
    }
    hasWhereDoesntHave(key) {
        return true; // todo think about this.
    }
    hasWhereDoesntHaveComplicated(key) {
        return true; // todo think about this.
    }
    getWhereStatementController() {
        return this.whereStatementController;
    }
    getRelation() {
        return this.relation;
    }
    processCallback(callback) {
        new where_all_have_statement_callback_1.WhereAllHaveStatementCallback(this, callback);
    }
}
exports.WhereAllHaveStatementCallbackStatement = WhereAllHaveStatementCallbackStatement;
