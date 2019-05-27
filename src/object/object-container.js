"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("./object");
class ObjectContainer {
    constructor() {
        this.objects = [];
    }
    add(config, rds) {
        const newObject = new object_1.RdsObject(config, rds);
        this.objects.push(newObject);
    }
    has(name) {
        for (const object of this.objects) {
            if (name === object.getModelName()) {
                return true;
            }
        }
        return false;
    }
    hasPretty(name) {
        for (const object of this.objects) {
            if (name === object.getPrettyName()) {
                return true;
            }
        }
        return false;
    }
    get() {
        return this.objects;
    }
    find(name) {
        name = name.toLocaleLowerCase();
        for (const object of this.objects) {
            if (name === object.getModelName()) {
                return object;
            }
        }
        return null;
    }
    findPretty(name) {
        for (const object of this.objects) {
            if (name === object.getPrettyName()) {
                return object;
            }
        }
        return null;
    }
}
exports.ObjectContainer = ObjectContainer;
