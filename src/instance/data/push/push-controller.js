"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PushController {
    constructor(collector, instanceData) {
        this.collector = collector;
        this.instanceData = instanceData;
    }
    setData(data) {
        if (!data) {
            return;
        }
        this.data = data;
    }
}
exports.PushController = PushController;
