"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WhereExistsStatement {
    constructor(key) {
        this.key = key;
    }
    check(object) {
        return !!(object.hasOwnProperty(this.key));
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
exports.WhereExistsStatement = WhereExistsStatement;
