"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddCollector {
    constructor() {
        this.data = {};
    }
    find(key) {
        // todo error here?
        if (!this.has(key)) {
            return [];
        }
        return this.data[key].slice();
    }
    has(key) {
        return this.data.hasOwnProperty(key);
    }
    add(target, objects) {
        if (!this.data.hasOwnProperty(target)) {
            this.data[target] = [];
        }
        //todo we do have to check if there are no duplicates?!
        for (const object of objects) {
            this.data[target].push(object);
        }
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
}
exports.AddCollector = AddCollector;
