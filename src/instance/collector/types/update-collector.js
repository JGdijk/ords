"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateCollector {
    constructor() {
        this.data = {};
    }
    add(target, objects) {
        if (!this.data.hasOwnProperty(target)) {
            this.data[target] = [];
        }
        for (const object of objects) {
            this.data[target].push(object);
        }
    }
    find(key) {
        // todo error here?
        // todo this is not immutable, multiple pushControllers get the same object. fix in pushcontrollers.
        if (!this.has(key)) {
            return [];
        }
        return this.data[key].slice();
    }
    keys() {
        let keys = [];
        for (const i in this.data) {
            if (!this.data.hasOwnProperty(i)) {
                continue;
            }
            keys.push(i);
        }
        return keys;
    }
    has(key) {
        return this.data.hasOwnProperty(key);
    }
}
exports.UpdateCollector = UpdateCollector;
