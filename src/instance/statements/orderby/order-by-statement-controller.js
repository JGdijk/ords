"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_by_statement_1 = require("./order-by-statement");
class OrderByStatementController {
    constructor(key) {
        this.statements = [];
        this.default_statement = new order_by_statement_1.OrderByStatement(key, 'asc');
    }
    add(statement) {
        this.statements.push(statement);
    }
    has() {
        return (this.statements.length > 0);
    }
    order(objects) {
        for (const statement of this.statements) {
            objects = statement.order(objects);
        }
        return objects;
    }
    orderDefault(objects) {
        return this.default_statement.order(objects);
    }
}
exports.OrderByStatementController = OrderByStatementController;
