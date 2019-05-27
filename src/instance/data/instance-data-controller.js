"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instance_data_1 = require("./instance-data");
const operators_1 = require("rxjs/operators");
class InstanceDataController {
    constructor(rds, object) {
        this.data = new instance_data_1.InstanceData(object);
        this.rds = rds;
        this.observer = true;
    }
    /*************************** retrieving ***************************
     ******************************************************************/
    find(ids) {
        this.returnType = 'find';
        this.data.setIds(ids);
        return this.results();
    }
    first() {
        this.returnType = 'first';
        return this.results();
    }
    get() {
        this.returnType = 'get';
        return this.results();
    }
    getIds() {
        this.returnType = 'getids';
        return this.results();
    }
    count() {
        this.returnType = 'count';
        return this.results();
    }
    // static functions
    findStatic(ids) {
        this.returnType = 'find';
        this.data.setIds(ids);
        return this.returnData();
    }
    firstStatic() {
        this.returnType = 'first';
        return this.returnData();
    }
    getStatic() {
        this.returnType = 'get';
        return this.returnData();
    }
    getIdsStatic() {
        this.returnType = 'getids';
        return this.returnData();
    }
    countStatic() {
        this.returnType = 'count';
        return this.returnData();
    }
    results() {
        if (!this.observer) {
            return this.returnData();
        }
        else {
            return this.rds.getBroadcaster()
                .pipe(operators_1.startWith(null), operators_1.filter((collector) => {
                return (!collector)
                    ? true
                    : this.push(collector);
            }), operators_1.map(() => this.returnData()));
        }
    }
    returnData() {
        switch (this.returnType) {
            case 'find':
                return this.data.first();
            case 'first':
                return this.data.first();
            case 'get':
                return this.data.get();
            case 'getids':
                return this.data.getDataIds();
            case 'count':
                return this.data.get().length;
        }
    }
    getInstanceData() {
        return this.data;
    }
    push(collector) {
        const collectorCheckResult = collector.check(this.data);
        if (collectorCheckResult.shouldPush()) {
            this.getInstanceData().set(collectorCheckResult.getData());
            return true;
        }
        return false;
    }
}
exports.InstanceDataController = InstanceDataController;
