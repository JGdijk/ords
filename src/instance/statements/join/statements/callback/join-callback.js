"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_by_statement_1 = require("../../../orderby/order-by-statement");
const join_callback_statement_1 = require("./join-callback-statement");
const where_statement_1 = require("../../../where/statements/where-statement");
const join_statement_1 = require("../join-statement");
const where_statement_callback_statement_1 = require("../../../where/statements/callback/where/where-statement-callback-statement");
const where_between_statement_1 = require("../../../where/statements/where-between-statement");
const where_not_between_statement_1 = require("../../../where/statements/where-not-between-statement");
const where_in_statement_1 = require("../../../where/statements/where-in-statement");
const where_not_in_statement_1 = require("../../../where/statements/where-not-in-statement");
const where_has_statement_callback_statement_1 = require("../../../where/statements/callback/where-has/where-has-statement-callback-statement");
const where_has_statement_1 = require("../../../where/statements/where-has-statement");
const where_doesnt_have_statement_callback_statement_1 = require("../../../where/statements/callback/where-doesnt-have/where-doesnt-have-statement-callback-statement");
const where_doesnt_have_statement_1 = require("../../../where/statements/where-doesnt-have-statement");
class JoinCallback {
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
    with(name, callback) {
        if (callback && !Array.isArray(name)) {
            if (!this.statement.getRelation().getRelationObject().getRelationContainer().hasByObjectName(name)) {
                return this;
            }
            const relation = this.statement.getRelation().getRelationObject().getRelationContainer().findByObjectName(name);
            this.statement.getJoinStatementController().add(new join_callback_statement_1.JoinCallbackStatement(relation, callback));
        }
        else {
            if (!Array.isArray(name)) {
                if (!this.statement.getRelation().getRelationObject().getRelationContainer().hasByObjectName(name)) {
                    return this;
                }
                const relation = this.statement.getRelation().getRelationObject().getRelationContainer().findByObjectName(name);
                this.statement.getJoinStatementController().add(new join_statement_1.JoinStatement(relation));
            }
            else {
                for (const v of name) {
                    if (!this.statement.getRelation().getRelationObject().getRelationContainer().hasByObjectName(v)) {
                        return this;
                    }
                    const relation = this.statement.getRelation().getRelationObject().getRelationContainer().findByObjectName(v);
                    this.statement.getJoinStatementController().add(new join_statement_1.JoinStatement(relation));
                }
            }
        }
        return this;
    }
    orderBy(key, order) {
        this.statement.getOrderByStatementController().add(new order_by_statement_1.OrderByStatement(key, order));
        return this;
    }
}
exports.JoinCallback = JoinCallback;
