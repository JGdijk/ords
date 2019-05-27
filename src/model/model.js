"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// todo we would like to remove rds from it.
const rds_container_1 = require("../rds-container");
class Model {
    constructor(data) {
        if (data) {
            Object.assign(this, data);
        }
    }
    save() {
        const key = this.constructor.name;
        const rds = rds_container_1.rdsContainer.first();
        const object = rds.getObjectContainer().find(key);
        if (!this.hasOwnProperty(object.getPrimaryKey())) {
            // todo error can't update
            return;
        }
        if (!object.has(this[object.getPrimaryKey()])) {
            rds.add(key, Object.assign({}, this));
        }
        else {
            rds.update(key, this[object.getPrimaryKey()], Object.assign({}, this));
        }
    }
    update(data) {
        const key = this.constructor.name;
        const rds = rds_container_1.rdsContainer.first();
        const object = rds.getObjectContainer().find(key);
        if (!this.hasOwnProperty(object.getPrimaryKey())) {
            // todo error can't update
            return;
        }
        if (!object.has(this[object.getPrimaryKey()])) {
            // todo error object doesn't exist
            return;
        }
        rds.update(key, this[object.getPrimaryKey()], data);
    }
    remove() {
        const key = this.constructor.name;
        const rds = rds_container_1.rdsContainer.first();
        const object = rds.getObjectContainer().find(key);
        if (!this.hasOwnProperty(object.getPrimaryKey())) {
            // todo error can't update
            return;
        }
        if (!object.has(this[object.getPrimaryKey()])) {
            // todo error object doesn't exist
            return;
        }
        rds.remove(key, this[object.getPrimaryKey()]);
    }
    attach(relation, ids) {
        const key = this.constructor.name;
        const rds = rds_container_1.rdsContainer.first();
        const object = rds.getObjectContainer().find(key);
        if (!this.hasOwnProperty(object.getPrimaryKey())) {
            // todo error can't update
            return;
        }
        if (!object.has(this[object.getPrimaryKey()])) {
            // todo error object doesn't exist
            return;
        }
        const ids_array = (!Array.isArray(ids)) ? [ids] : ids;
        rds.attach(key, relation, [this[object.getPrimaryKey()]], ids_array);
    }
    detach(relation, ids) {
        const key = this.constructor.name;
        const rds = rds_container_1.rdsContainer.first();
        const object = rds.getObjectContainer().find(key);
        if (!this.hasOwnProperty(object.getPrimaryKey())) {
            // todo error can't update
            return;
        }
        if (!object.has(this[object.getPrimaryKey()])) {
            // todo error object doesn't exist
            return;
        }
        const ids_array = (!Array.isArray(ids)) ? [ids] : ids;
        rds.detach(key, relation, [this[object.getPrimaryKey()]], ids_array);
    }
}
exports.Model = Model;
