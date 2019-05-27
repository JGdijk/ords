"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instance_1 = require("./instance");
class InstanceController {
    constructor(rds, object) {
        this.rds = rds;
        this.object = object;
    }
    /*************************** retrieving ***************************
     ******************************************************************/
    find(ids) {
        return this.getInstance().find(ids);
    }
    first() {
        return this.getInstance().first();
    }
    get() {
        return this.getInstance().get();
    }
    getIds() {
        return this.getInstance().getIds();
    }
    count() {
        return this.getInstance().count();
    }
    // static
    findStatic(ids) {
        return this.getInstance().findStatic(ids);
    }
    firstStatic() {
        return this.getInstance().firstStatic();
    }
    getStatic() {
        return this.getInstance().getStatic();
    }
    getIdsStatic() {
        return this.getInstance().getIdsStatic();
    }
    countStatic() {
        return this.getInstance().countStatic();
    }
    /*************************** where statements ***************************
     ******************************************************************/
    where(key, action, value) {
        return this.getInstance().where(key, action, value);
    }
    orWhere(key, action, value) {
        return this.getInstance().orWhere(key, action, value);
    }
    whereBetween(key, low, high) {
        return this.getInstance().whereBetween(key, low, high);
    }
    whereNotBetween(key, low, high) {
        return this.getInstance().whereNotBetween(key, low, high);
    }
    whereIn(key, values) {
        return this.getInstance().whereIn(key, values);
    }
    whereNotIn(key, values) {
        return this.getInstance().whereNotIn(key, values);
    }
    whereExists(key) {
        return this.getInstance().whereExists(key);
    }
    whereNotExists(key) {
        return this.getInstance().whereNotExists(key);
    }
    whereEmpty(key) {
        return this.getInstance().whereEmpty(key);
    }
    whereNotEmpty(key) {
        return this.getInstance().whereNotEmpty(key);
    }
    whereHas(key, callback) {
        return this.getInstance().whereHas(key, callback);
    }
    whereDoesntHave(key, callback) {
        return this.getInstance().whereDoesntHave(key, callback);
    }
    /*************************** ordery by ***************************
     ******************************************************************/
    orderBy(key, order) {
        return this.getInstance().orderBy(key, order);
    }
    /*************************** join ***************************
     ******************************************************************/
    with(name, callback) {
        return this.getInstance().with(name, callback);
    }
    /*************************** direct actions ***************************
     ******************************************************************/
    //
    add(objects) {
        this.rds.add(this.object.getModelName(), objects);
    }
    update(data) {
        this.getInstance().update(data);
    }
    remove(ids) {
        this.getInstance().remove(ids);
    }
    attach(relation_name, relation_ids) {
        this.getInstance().attach(relation_name, relation_ids);
    }
    detach(relation_name, relation_ids) {
        this.getInstance().detach(relation_name, relation_ids);
    }
    /*************************** helpers ***************************
     ******************************************************************/
    getInstance() {
        return new instance_1.Instance(this.rds, this.object);
    }
}
exports.InstanceController = InstanceController;
