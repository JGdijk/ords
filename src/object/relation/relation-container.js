"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hasOne_1 = require("./types/hasOne");
const hasMany_1 = require("./types/hasMany");
const silent_1 = require("./types/silent");
class RelationContainer {
    constructor() {
        this.relations = [];
    }
    initReverse() {
        for (const relation of this.relations) {
            relation.initReverse();
        }
    }
    add(config, local_name, rds) {
        switch (config.type) {
            case 'silent':
                this.relations.push(new silent_1.SilentRelation(config, local_name, rds));
                break;
            case 'hasOne':
                this.relations.push(new hasOne_1.HasOne(config, local_name, rds));
                break;
            case 'hasMany':
                this.relations.push(new hasMany_1.HasMany(config, local_name, rds));
                break;
        }
    }
    findByObjectName(key) {
        for (const relation of this.relations) {
            if (key === relation.getObjectName()) {
                return relation;
            }
        }
        return null;
    }
    findByModelName(key) {
        for (const relation of this.relations) {
            if (key === relation.getModelName()) {
                return relation;
            }
        }
        return null;
    }
    hasByObjectName(key) {
        for (const relation of this.relations) {
            if (key === relation.getObjectName()) {
                return true;
            }
        }
        return false;
    }
    hasByModelName(key) {
        for (const relation of this.relations) {
            if (key === relation.getModelName()) {
                return true;
            }
        }
        return false;
    }
    isEmpty() {
        return !(this.relations.length);
    }
}
exports.RelationContainer = RelationContainer;
