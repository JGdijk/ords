"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collector_push_result_1 = require("./collector-push-result");
const adder_1 = require("./types/adder");
const updater_1 = require("./types/updater");
const remover_1 = require("./types/remover");
const attacher_1 = require("./types/attacher");
const detacher_1 = require("./types/detacher");
class PushController {
    constructor(collectorController, instanceData) {
        this.collectorController = collectorController;
        this.instanceData = instanceData;
        this.adder = new adder_1.Adder(this);
        this.updater = new updater_1.Updater(this);
        this.remover = new remover_1.Remover(this);
        this.attacher = new attacher_1.Attacher(this);
        this.detacher = new detacher_1.Detacher(this);
        this.checked = false;
        this.new_data_used = false;
    }
    check() {
        this.adder.run();
        this.attacher.run();
        this.detacher.run();
        this.updater.run();
        this.remover.run();
        return new collector_push_result_1.CollectorPushResult(this.checked, this.new_data);
    }
    getCollectorController() {
        return this.collectorController;
    }
    getInstanceData() {
        return this.instanceData;
    }
    setChecked() {
        this.checked = true;
    }
    setData(data) {
        this.new_data = data;
        this.new_data_used = true;
    }
    getData() {
        if (this.new_data_used) {
            return this.new_data;
        }
        this.new_data = this.instanceData.get().slice();
        this.new_data_used = true;
        return this.new_data;
    }
}
exports.PushController = PushController;
