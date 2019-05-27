"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WhereHasStatement {
    constructor(relation) {
        this.relation = relation;
    }
    check(object) {
        //todo maybe better primary key check / error?
        const primary_key = this.relation.getLocalObject().getPrimaryKey();
        if (!object.hasOwnProperty(primary_key)) {
            return false;
        }
        return this.relation.has(object[primary_key]);
    }
    filter(objects) {
        return objects.filter((objects) => {
            return this.check(objects);
        });
    }
    has(key) {
        return (this.relation.getRelationObject().getModelName() === key);
    }
    hasWhereHas(key) {
        if (!key) {
            return true;
        }
        return !!(key === this.relation.getModelName());
    }
    hasWhereHasComplicated(key) { return false; }
    hasWhereDoesntHave(key) { return false; }
    hasWhereDoesntHaveComplicated(key) { return false; }
}
exports.WhereHasStatement = WhereHasStatement;
