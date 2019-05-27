"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AttachCollector {
    constructor() {
        this.data = {};
    }
    find(object_name, object_id, relation_name) {
        if (!this.has(object_name, relation_name, object_id)) {
            return [];
        }
        return this.data[object_name][relation_name][object_id].slice();
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
    has(object_name, relation_name, object_id) {
        if (!this.data.hasOwnProperty(object_name)) {
            return false;
        }
        if (!relation_name) {
            return false;
        }
        else {
            if (!this.data[object_name].hasOwnProperty(relation_name)) {
                return false;
            }
            if (!object_id) {
                return false;
            }
            else {
                if (!this.data[object_name][relation_name].hasOwnProperty(object_id)) {
                    return false;
                }
            }
        }
        return true;
    }
    add(object_name, relation_name, object_id, relation_ids) {
        if (!this.data.hasOwnProperty(object_name)) {
            this.data[object_name] = {};
        }
        if (!this.data[object_name].hasOwnProperty(relation_name)) {
            this.data[object_name][relation_name] = {};
        }
        if (!this.data[object_name][relation_name][object_id]) {
            this.data[object_name][relation_name][object_id] = [];
        }
        for (const id of relation_ids) {
            this.data[object_name][relation_name][object_id].push(id);
        }
    }
}
exports.AttachCollector = AttachCollector;
