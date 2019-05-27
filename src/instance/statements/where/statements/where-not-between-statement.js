"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WhereNotBetweenStatement {
    constructor(key, low, high) {
        this.key = key;
        this.low = low;
        this.high = high;
    }
    check(object) {
        if (!object.hasOwnProperty(this.key)) {
            return false;
        }
        return !!(object[this.key] < this.low || object[this.key] > this.high);
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
exports.WhereNotBetweenStatement = WhereNotBetweenStatement;
