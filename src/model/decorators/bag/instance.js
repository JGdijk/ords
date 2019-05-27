"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Instance {
    constructor(name) {
        this.name = name.toLowerCase();
        this.dates = [];
        this.stringify_objects = [];
        this.relations = [];
    }
    setPrimaryKey(primary_key) {
        this.primary_key = primary_key;
    }
    getPrimaryKey() {
        return this.primary_key;
    }
    addDate(key) {
        this.dates.push(key);
    }
    getDates() {
        return this.dates;
    }
    addStringifyObject(key) {
        this.stringify_objects.push(key);
    }
    getStringifyObjects() {
        return this.stringify_objects;
    }
    addRelation(relationConfig) {
        this.relations.push(relationConfig);
    }
    getRelations() {
        return this.relations;
    }
}
exports.Instance = Instance;
