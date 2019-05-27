"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const where_statement_controller_1 = require("../../../where-statement-controller");
const where_statement_callback_1 = require("./where-statement-callback");
class WhereStatementCallbackStatement {
    constructor(callback, object) {
        this.object = object;
        this.whereStatementController = new where_statement_controller_1.WhereStatementController(this.object);
        this.processCallback(callback);
    }
    has(key) {
        return this.whereStatementController.has(key);
    }
    hasWhereHas(key) {
        return this.whereStatementController.hasWhereHas(key);
    }
    hasWhereHasComplicated(key) {
        return this.whereStatementController.hasWhereHasComplicated(key);
    }
    hasWhereDoesntHave(key) {
        return this.whereStatementController.hasWhereDoesntHave(key);
    }
    hasWhereDoesntHaveComplicated(key) {
        return this.whereStatementController.hasWhereDoesntHaveComplicated(key);
    }
    check(object) {
        return this.whereStatementController.check(object);
    }
    filter(objects) {
        return this.whereStatementController.filter(objects);
    }
    getWhereStatementController() {
        return this.whereStatementController;
    }
    getObject() {
        return this.object;
    }
    processCallback(callback) {
        new where_statement_callback_1.WhereStatementCallback(this, callback);
    }
}
exports.WhereStatementCallbackStatement = WhereStatementCallbackStatement;
