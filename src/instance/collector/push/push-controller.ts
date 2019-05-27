
import {InstanceData} from "../../data/instance-data";
import {CollectorPushResult} from "./collector-push-result";
import {CollectorController} from "../collector-controller";
import {Adder} from "./types/adder";
import {Updater} from "./types/updater";
import {Remover} from "./types/remover";
import {Attacher} from "./types/attacher";
import {Detacher} from "./types/detacher";

export class PushController {

    private collectorController: CollectorController;
    private instanceData: InstanceData;

    private new_data: any[];

    private new_data_used: boolean;

    private adder: Adder;
    private updater: Updater;
    private remover: Remover;
    private attacher: Attacher;
    private detacher: Detacher

    private checked: boolean;

    constructor(collectorController: CollectorController, instanceData: InstanceData) {
        this.collectorController = collectorController;
        this.instanceData = instanceData;

        this.adder = new Adder(this);
        this.updater = new Updater(this);
        this.remover = new Remover(this);
        this.attacher = new Attacher(this);
        this.detacher = new Detacher(this);

        this.checked = false;
        this.new_data_used = false;
    }

    public check(): CollectorPushResult {
        this.adder.run();
        this.attacher.run();
        this.detacher.run();
        this.updater.run();
        this.remover.run();

        return new CollectorPushResult(this.checked, this.new_data);
    }

    public getCollectorController(): CollectorController {
        return this.collectorController;
    }

    public getInstanceData(): InstanceData {
        return this.instanceData;
    }

    public setChecked(): void {
        this.checked = true;
    }

    public setData(data: any[]): void {
        this.new_data = data;
        this.new_data_used = true;
    }

    public getData(): any[] {
        if (this.new_data_used) { return this.new_data; }

        this.new_data = this.instanceData.get().slice();
        this.new_data_used = true;

        return this.new_data;
    }

}