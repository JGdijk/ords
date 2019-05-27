"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RdsContainer {
    constructor() {
        this.instances = [];
    }
    add(rds) {
        this.instances.push(rds);
    }
    first() {
        // todo error on empty
        return this.instances[0];
    }
}
exports.rdsContainer = new RdsContainer();
