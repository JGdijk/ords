"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const where_doesnt_have_statement_callback_statement_1 = require("./where-doesnt-have-statement-callback-statement");
const where_statement_1 = require("../../where-statement");
const where_statement_callback_statement_1 = require("../where/where-statement-callback-statement");
const where_between_statement_1 = require("../../where-between-statement");
const where_not_between_statement_1 = require("../../where-not-between-statement");
const where_in_statement_1 = require("../../where-in-statement");
const where_not_in_statement_1 = require("../../where-not-in-statement");
const where_has_statement_callback_statement_1 = require("../where-has/where-has-statement-callback-statement");
const where_has_statement_1 = require("../../where-has-statement");
const where_doesnt_have_statement_1 = require("../../where-doesnt-have-statement");
class WhereDoesntHaveStatementCallback {
    constructor(statement, callback) {
        this.statement = statement;
        callback(this);
    }
    where(key, action, value) {
        if (action) {
            this.statement.getWhereStatementController().add(new where_statement_1.WhereStatement(key, action, value));
        }
        else {
            this.statement.getWhereStatementController().add(new where_statement_callback_statement_1.WhereStatementCallbackStatement(key, this.statement.getRelation().getRelationObject()));
        }
        return this;
    }
    orWhere(key, action, value) {
        if (action) {
            this.statement.getWhereStatementController().addNewBag(new where_statement_1.WhereStatement(key, action, value));
        }
        else {
            this.statement.getWhereStatementController().addNewBag(new where_statement_callback_statement_1.WhereStatementCallbackStatement(key, this.statement.getRelation().getRelationObject()));
        }
        return this;
    }
    whereBetween(key, low, high) {
        this.statement.getWhereStatementController().add(new where_between_statement_1.WhereBetweenStatement(key, low, high));
        return this;
    }
    whereNotBetween(key, low, high) {
        this.statement.getWhereStatementController().add(new where_not_between_statement_1.WhereNotBetweenStatement(key, low, high));
        return this;
    }
    whereIn(key, values) {
        this.statement.getWhereStatementController().add(new where_in_statement_1.WhereInStatement(key, values));
        return this;
    }
    whereNotIn(key, values) {
        this.statement.getWhereStatementController().add(new where_not_in_statement_1.WhereNotInStatement(key, values));
        return this;
    }
    whereHas(key, callback) {
        //todo checks if relation is not found
        const relation = this.statement.getRelation().getRelationObject().getRelationContainer().findByObjectName(key);
        if (callback) {
            this.statement.getWhereStatementController().add(new where_has_statement_callback_statement_1.WhereHasStatementCallbackStatement(relation, callback));
        }
        else {
            this.statement.getWhereStatementController().add(new where_has_statement_1.WhereHasStatement(relation));
        }
        return this;
    }
    whereDoesntHave(key, callback) {
        //todo checks if relation is not found
        const relation = this.statement.getRelation().getRelationObject().getRelationContainer().findByObjectName(key);
        if (callback) {
            this.statement.getWhereStatementController().add(new where_doesnt_have_statement_callback_statement_1.WhereDoesntHaveStatementCallbackStatement(relation, callback));
        }
        else {
            this.statement.getWhereStatementController().add(new where_doesnt_have_statement_1.WhereDoesntHaveStatement(relation));
        }
        return this;
    }
}
exports.WhereDoesntHaveStatementCallback = WhereDoesntHaveStatementCallback;
