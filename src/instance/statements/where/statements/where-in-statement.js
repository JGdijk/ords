"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WhereInStatement {
    constructor(key, values) {
        this.key = key;
        this.values = values;
    }
    check(object) {
        if (!object.hasOwnProperty(this.key)) {
            return false;
        }
        return !!(this.values.includes(object[this.key]));
    }
    filter(objects) {
        return objects.filter((objects) => {
            return this.check(objects);
        });
    }
    has(key) { return false; }
    hasWhereHas(key) { return false; }
    hasWhereHasComplicated(key) { return false; }
    hasWhereDoesntHave(key) { return false; }
    hasWhereDoesntHaveComplicated(key) { return false; }
}
exports.WhereInStatement = WhereInStatement;
