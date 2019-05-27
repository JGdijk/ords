"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WhereDoesntHaveStatement {
    constructor(relation) {
        this.relation = relation;
    }
    has(key) {
        return (this.relation.getRelationObject().getModelName() === key);
    }
    hasWhereHas(key) { return false; }
    hasWhereHasComplicated(key) { return false; }
    hasWhereDoesntHave(key) {
        if (!key) {
            return true;
        }
        return !!(key === this.relation.getModelName());
    }
    hasWhereDoesntHaveComplicated(key) { return false; }
    check(object) {
        //todo maybe better primary key check / error?
        const primary_key = this.relation.getLocalObject().getPrimaryKey();
        if (!object.hasOwnProperty(primary_key)) {
            return false;
        }
        return !this.relation.has(object[primary_key]);
    }
    filter(objects) {
        return objects.filter((objects) => {
            return this.check(objects);
        });
    }
}
exports.WhereDoesntHaveStatement = WhereDoesntHaveStatement;
