"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const push_controller_1 = require("./push/push-controller");
const collector_controller_1 = require("./collector-controller");
class Collector {
    constructor() {
        this.controller = new collector_controller_1.CollectorController();
    }
    add(target, objects) {
        this.controller.add(target, objects);
    }
    update(target, objects) {
        this.controller.update(target, objects);
    }
    remove(target, ids) {
        this.controller.remove(target, ids);
    }
    attach(object_name, relation_name, object_id, relation_ids) {
        this.controller.attach(object_name, relation_name, object_id, relation_ids);
    }
    detach(object_name, relation_name, object_id, relation_ids) {
        this.controller.detach(object_name, relation_name, object_id, relation_ids);
    }
    check(instanceData) {
        const pushController = new push_controller_1.PushController(this.controller, instanceData);
        return pushController.check();
    }
}
exports.Collector = Collector;
