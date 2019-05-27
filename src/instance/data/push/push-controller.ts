import {Collector} from "../../collector/collector";
import {InstanceData} from "../instance-data";

export class PushController {

    private collector: Collector;

    private instanceData: InstanceData;

    private data: any[];

    constructor(collector: Collector, instanceData: InstanceData) {
        this.collector = collector;
        this.instanceData = instanceData;
    }

    public setData(data: any[]): void {
        if (!data) { return; }
        this.data = data;
    }


}