"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WhereNotEmptyStatement {
    constructor(key) {
        this.key = key;
    }
    check(object) {
        if (!object.hasOwnProperty(this.key)) {
            return true;
        }
        if (object[this.key] === null) {
            return true;
        }
        if (object[this.key] === undefined) {
            return true;
        }
        if (object[this.key] === 0) {
            return true;
        }
        if (object[this.key] === 0.0) {
            return true;
        }
        if (object[this.key] === '') {
            return true;
        }
        if (object[this.key] === '0') {
            return true;
        }
        if (object[this.key] === false) {
            return true;
        }
        return !!(Array.isArray(object[this.key]) && object[this.key].length === 0);
    }
    filter(objects) {
        return objects.filter((objects) => {
            return !this.check(objects);
        });
    }
    has(key) { return false; }
    hasWhereHas(key) { return false; }
    hasWhereHasComplicated(key) { return false; }
    hasWhereDoesntHave(key) { return false; }
    hasWhereDoesntHaveComplicated(key) { return false; }
}
exports.WhereNotEmptyStatement = WhereNotEmptyStatement;
