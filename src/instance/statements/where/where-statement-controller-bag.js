"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WhereStatementControllerBag {
    constructor() {
        this.statements = [];
    }
    add(statement) {
        this.statements.push(statement);
    }
    has(key) {
        if (!key) {
            return (this.statements.length > 0);
        }
        for (const statement of this.statements) {
            if (statement.has(key)) {
                return true;
            }
        }
        return false;
    }
    hasWhereHas(key) {
        for (const statement of this.statements) {
            if (statement.hasWhereHas(key)) {
                return true;
            }
        }
        return false;
    }
    hasWhereHasComplicated(key) {
        for (const statement of this.statements) {
            if (statement.hasWhereHasComplicated(key)) {
                return true;
            }
        }
        return false;
    }
    hasWhereDoesntHave(key) {
        for (const statement of this.statements) {
            if (statement.hasWhereDoesntHave(key)) {
                return true;
            }
        }
        return false;
    }
    hasWhereDoesntHaveComplicated(key) {
        for (const statement of this.statements) {
            if (statement.hasWhereDoesntHaveComplicated(key)) {
                return true;
            }
        }
        return false;
    }
    filter(objects) {
        for (const statement of this.statements) {
            objects = statement.filter(objects);
        }
        return objects;
    }
    check(object) {
        if (!object) {
            return;
        }
        for (const statement of this.statements) {
            if (!statement.check(object)) {
                return false;
            }
        }
        return true;
    }
}
exports.WhereStatementControllerBag = WhereStatementControllerBag;
