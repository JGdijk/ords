"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JoinStatementController {
    constructor() {
        this.statements = [];
    }
    add(statement) {
        this.statements.push(statement);
    }
    has(key) {
        if (!key) {
            return !!(this.statements.length);
        }
        for (const statement of this.statements) {
            if (statement.has(key)) {
                return true;
            }
        }
        return false;
    }
    attach(object) {
        for (const statement of this.statements) {
            statement.attach(object);
        }
    }
    attachMany(objects) {
        for (const object of objects) {
            this.attach(object);
        }
    }
    getRelations() {
        let relations = [];
        for (const statement of this.statements) {
            relations.push(statement.getRelation());
        }
        return relations;
    }
    getStatements() {
        return this.statements;
    }
}
exports.JoinStatementController = JoinStatementController;
