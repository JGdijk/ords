"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WhereStatement {
    constructor(key, action, value) {
        this.key = key;
        this.action = action;
        this.value = value;
    }
    check(object) {
        if (!object.hasOwnProperty(this.key)) {
            return false;
        }
        switch (this.action) {
            case '=':
                return (object[this.key] === this.value);
            case '!=':
                return (object[this.key] !== this.value);
            case '>':
                return (object[this.key] > this.value);
            case '<':
                return (object[this.key] < this.value);
            default:
                return false;
        }
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
exports.WhereStatement = WhereStatement;
