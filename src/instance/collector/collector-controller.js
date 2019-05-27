"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add_collector_1 = require("./types/add-collector");
const update_collector_1 = require("./types/update-collector");
const remove_collector_1 = require("./types/remove-collector");
const attach_collector_1 = require("./types/attach-collector");
const detach_collector_1 = require("./types/detach-collector");
class CollectorController {
    constructor(addCollector, updateCollector, removeCollector, attachCollector, detachCollector) {
        this.addCollector = (addCollector) ? addCollector : new add_collector_1.AddCollector();
        this.updateCollector = (updateCollector) ? updateCollector : new update_collector_1.UpdateCollector();
        this.removeCollector = (removeCollector) ? removeCollector : new remove_collector_1.RemoveCollector();
        this.attachCollector = (attachCollector) ? attachCollector : new attach_collector_1.AttachCollector();
        this.detachCollector = (detachCollector) ? detachCollector : new detach_collector_1.DetachCollector();
    }
    add(target, objects) {
        this.addCollector.add(target, objects);
    }
    update(target, objects) {
        this.updateCollector.add(target, objects);
    }
    remove(target, ids) {
        this.removeCollector.add(target, ids);
    }
    attach(object_name, relation_name, object_id, relation_ids) {
        this.attachCollector.add(object_name, relation_name, object_id, relation_ids);
    }
    detach(object_name, relation_name, object_id, relation_ids) {
        this.detachCollector.add(object_name, relation_name, object_id, relation_ids);
    }
    getAddCollector() { return this.addCollector; }
    getUpdateCollector() { return this.updateCollector; }
    getRemoveCollector() { return this.removeCollector; }
    getAttachCollector() { return this.attachCollector; }
    getDetachCollector() { return this.detachCollector; }
}
exports.CollectorController = CollectorController;
