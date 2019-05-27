"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JoinStatement {
    constructor(relation) {
        this.relation = relation;
    }
    attach(object) {
        object[this.relation.getObjectName()] = this.relation.findByObject(object, true);
    }
    has(key) {
        return !!(key === this.relation.getModelName());
    }
    getRelation() {
        return this.relation;
    }
    hasStatements() { return false; }
    getStatements() { return []; }
    hasWhereStatements() { return false; }
    getWhereStatementController() { return null; }
    hasOrderByStatements() { return false; }
    getOrderByStatementController() { return null; }
}
exports.JoinStatement = JoinStatement;
