"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CollectorPushResult {
    constructor(should_push, data) {
        this.should_push = should_push;
        this.data = data;
    }
    shouldPush() {
        return this.should_push;
    }
    getData() {
        return this.data;
    }
}
exports.CollectorPushResult = CollectorPushResult;
