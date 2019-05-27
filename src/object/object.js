"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const relation_container_1 = require("./relation/relation-container");
const model_decorator_bag_1 = require("../model/decorators/bag/model-decorator-bag");
const object_data_1 = require("./object-data");
const instance_controller_1 = require("../instance/instance-controller");
class RdsObject {
    constructor(config, rds) {
        this.rds = rds;
        this.relationContainer = new relation_container_1.RelationContainer();
        this.pretty_name = config.name.toLowerCase();
        const funcNameRegex = /function (.{1,})\(/;
        this.model_name = (funcNameRegex).exec(config.model.prototype.constructor.toString())[1].toLowerCase();
        const parent = Object.getPrototypeOf(config.model.prototype);
        this.parent = (funcNameRegex).exec(parent.constructor.toString())[1].toLowerCase();
        this.model_constructor = config.model;
    }
    init() {
        if (!model_decorator_bag_1.modelDecoratorBag.has(this.getModelName())) {
            return;
        }
        const bag = model_decorator_bag_1.modelDecoratorBag.get(this.getModelName());
        this.setPrimaryKey(bag.getPrimaryKey());
        this.dates = bag.getDates();
        this.immutables = bag.getStringifyObjects();
        for (const config of bag.getRelations()) {
            if (!this.rds.getObjectContainer().hasPretty(config.model_name)) {
                continue;
            }
            this.relationContainer.add(config, this.getModelName(), this.rds);
        }
        this.data = new object_data_1.ObjectData(this.primary_key);
    }
    // data functions
    has(id) {
        return this.data.has(id);
    }
    // todo what todo with nested objects that are no relations? Maybe make an immute property on the model?
    // todo if the property is checked on the model it will json stringfy that property always on retrieving.
    // todo at the moment we are not giving immutable data back here?
    find(ids) {
        let objects = [];
        for (const id of ids) {
            if (this.has(id)) {
                objects.push(Object.assign({}, this.data.find(id)));
            }
        }
        return objects;
    }
    // todo what todo with nested objects that are no relations? Maybe make an immute property on the model?
    // todo if the property is checked on the model it will json stringfy that property always on retrieving.
    // todo at the moment we are not giving immutable data back here?
    get() {
        // todo immutable
        return Array.from(this.data.get());
    }
    add(objects_original, collector) {
        // todo we could optimize this, when adding nested relations we don't need to json.parse it anymore.
        // todo so we could make another add function only called when inherit nested relations
        // todo also we could make an option to not parse json on own risk.
        // we always want to work with an array
        const objects_array = (Array.isArray(objects_original)) ? objects_original : [objects_original];
        // we always want to work with clones, we don't want to mutate the given data.
        // todo take care of date who are not parsed back as a time/date object (minute.js)
        let objects = JSON.parse(JSON.stringify(objects_array));
        // if there are no relations we can simply add the objects
        if (this.getRelationContainer().isEmpty()) {
            collector.add(this.getPrettyName(), objects);
            return this.data.add(objects);
        }
        // now we have to check if each object has any relation info.
        for (let object of objects) {
            // todo check if primary key value is provided
            // todo we should do relations here
            for (const key of Object.keys(object)) {
                // if the object doesn't contain this key continue.
                if (!this.getRelationContainer().hasByObjectName(key)) {
                    continue;
                }
                //add relation
                const relation = object[key];
                this.getRelationContainer().findByObjectName(key).add(object[this.primary_key], relation, collector);
                // remove the relation from the object.
                delete object[key];
            }
        }
        collector.add(this.getPrettyName(), objects);
        return this.data.add(objects);
    }
    update(ids_original, data_original, collector) {
        // we always want to work with an array
        const ids = (Array.isArray(ids_original)) ? ids_original : [ids_original];
        // we don't want to mutate the give object
        console.log(data_original);
        const data = JSON.parse(JSON.stringify(data_original));
        // strip primary keys + relations
        for (const key of Object.keys(data)) {
            if (key === this.primary_key || this.getRelationContainer().hasByObjectName(key)) {
                delete data[key];
            }
        }
        const objects = this.data.update(ids, data);
        collector.update(this.getModelName(), objects);
    }
    remove(ids, collector) {
        ids = (Array.isArray(ids)) ? ids : [ids];
        this.data.remove(ids);
        collector.remove(this.getModelName(), ids);
    }
    getPrettyName() {
        return this.pretty_name;
    }
    getModelName() {
        return this.model_name;
    }
    getRelationContainer() {
        return this.relationContainer;
    }
    getPrimaryKey() {
        return this.primary_key;
    }
    instanceController() {
        return new instance_controller_1.InstanceController(this.rds, this);
    }
    createModel(object) {
        // todo this can be different?
        if (object && this.dates.length) {
            let new_object = Object.assign({}, object);
            for (const date of this.dates) {
                if (new_object.hasOwnProperty(date)) {
                    new_object[date] = new Date(new_object[date]);
                }
            }
            object = new_object;
        }
        if (object && this.immutables.length) {
            let new_object = Object.assign({}, object);
            for (const date of this.immutables) {
                if (new_object.hasOwnProperty(date)) {
                    new_object[date] = JSON.parse(JSON.stringify(new_object[date]));
                }
            }
            object = new_object;
        }
        return new this.model_constructor(object);
    }
    setPrimaryKey(primary_key) {
        this.primary_key = (primary_key)
            ? primary_key
            : 'id';
    }
}
exports.RdsObject = RdsObject;
