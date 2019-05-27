"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_container_1 = require("./object/object-container");
const model_decorator_bag_1 = require("./model/decorators/bag/model-decorator-bag");
const index_1 = require("rxjs/index");
const operators_1 = require("rxjs/operators");
const collector_1 = require("./instance/collector/collector");
const rds_container_1 = require("./rds-container");
class Rds {
    constructor() {
        this.objectContainer = new object_container_1.ObjectContainer();
        this.initBroadcasting();
    }
    config(configs) {
        // instantiate all the objects
        configs.forEach((config) => {
            this.objectContainer.add(config, this);
        });
        // instantiate all the relations
        for (const object of this.objectContainer.get()) {
            object.init();
        }
        // for (const object of this.objectContainer.get()) {
        //     object.getRelationContainer().initReverse();
        // }
        rds_container_1.rdsContainer.add(this);
        console.log(model_decorator_bag_1.modelDecoratorBag);
        console.log(this);
    }
    getObjectContainer() {
        return this.objectContainer;
    }
    //todo type
    add(key, objects) {
        const collector = new collector_1.Collector();
        this.getObjectContainer().find(key).add(objects, collector);
        console.log(collector);
        this.observer.next(collector);
    }
    update(key, ids, data) {
        const collector = new collector_1.Collector();
        this.getObjectContainer().find(key).update(ids, data, collector);
        this.observer.next(collector);
    }
    remove(key, ids) {
        const collector = new collector_1.Collector();
        this.getObjectContainer().find(key).remove(ids, collector);
        this.observer.next(collector);
    }
    attach(key, relation, key_ids, relation_ids) {
        const collector = new collector_1.Collector();
        //todo check if relation exists error?
        if (!this.getObjectContainer().find(key).getRelationContainer().hasByObjectName(relation)) {
            return;
        }
        this.getObjectContainer()
            .find(key)
            .getRelationContainer()
            .findByObjectName(relation)
            .attach(key_ids, relation_ids, collector);
        this.observer.next(collector);
    }
    detach(key, relation, key_ids, relation_ids) {
        const collector = new collector_1.Collector();
        //todo check if relation exists error?
        if (!this.getObjectContainer().find(key).getRelationContainer().hasByObjectName(relation)) {
            return;
        }
        this.getObjectContainer()
            .find(key)
            .getRelationContainer()
            .findByObjectName(relation)
            .detach(key_ids, relation_ids, collector);
        this.observer.next(collector);
    }
    getBroadcaster() {
        return this.broadcaster;
    }
    initBroadcasting() {
        this.broadcaster = new index_1.Observable(observer => {
            this.observer = observer;
        }).pipe(operators_1.publish());
        this.broadcaster.connect();
    }
}
exports.Rds = Rds;
exports.rds = new Rds();
