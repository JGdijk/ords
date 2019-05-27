"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WhereAllHaveStatement {
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
        for (const object of objects) {
            if (!this.check(object)) {
                return [];
            }
        }
        return objects;
    }
    has(key) {
        return (this.relation.getRelationObject().getModelName() === key);
    }
    hasWhereHas(key) {
        // we have to return true here because
        return true;
    }
    hasWhereHasComplicated(key) { return false; }
    hasWhereDoesntHave(key) { return false; }
    hasWhereDoesntHaveComplicated(key) { return false; }
}
exports.WhereAllHaveStatement = WhereAllHaveStatement;
