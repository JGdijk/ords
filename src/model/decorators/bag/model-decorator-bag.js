"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instance_1 = require("./instance");
class ModelDecoratorBag {
    constructor() {
        this.instances = [];
    }
    add(name) {
        const instance = new instance_1.Instance(name);
        this.instances.push(instance);
    }
    has(target) {
        for (const instance of this.instances) {
            if (instance.name === target) {
                return true;
            }
        }
        return false;
    }
    get(target) {
        for (const instance of this.instances) {
            if (instance.name === target) {
                return instance;
            }
        }
        return null;
    }
    setPrimaryKey(target, primary_key) {
        target = target.toLowerCase();
        if (!this.has(target)) {
            this.add(target);
        }
        this.get(target).setPrimaryKey(primary_key);
    }
    addDate(target, key) {
        target = target.toLowerCase();
        if (!this.has(target)) {
            this.add(target);
        }
        this.get(target).addDate(key);
    }
    addStringifyObject(target, key) {
        target = target.toLowerCase();
        if (!this.has(target)) {
            this.add(target);
        }
        this.get(target).addStringifyObject(key);
    }
    addRelation(target, config) {
        target = target.toLowerCase();
        if (!this.has(target)) {
            this.add(target);
        }
        this.get(target).addRelation(config);
    }
}
exports.modelDecoratorBag = new ModelDecoratorBag();
