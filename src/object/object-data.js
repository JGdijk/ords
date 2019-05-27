"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObjectData {
    constructor(primary_key) {
        this.primary_key = primary_key;
        this.data = new Map();
    }
    add(objects) {
        // todo if object doesn't hold primary key error
        // todo check if object already exists
        let ids = [];
        for (const object of objects) {
            this.data.set(object[this.primary_key], object);
            ids.push(object[this.primary_key]);
        }
        return ids;
    }
    update(ids, data) {
        let objects = [];
        for (const id of ids) {
            if (!this.data.has(id)) {
                continue;
            }
            const old_object = this.data.get(id);
            const new_object = Object.assign({}, old_object, data);
            this.data.set(id, new_object);
            objects.push(new_object);
        }
        return objects;
    }
    remove(ids) {
        for (const id of ids) {
            this.data.delete(id);
        }
    }
    has(key) {
        return this.data.has(key);
    }
    find(id) {
        return this.data.get(id);
    }
    get() {
        return this.data.values();
    }
}
exports.ObjectData = ObjectData;
