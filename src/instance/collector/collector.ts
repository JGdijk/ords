import {InstanceData} from "../data/instance-data";
import {CollectorPushResult} from "./push/collector-push-result";
import {PushController} from "./push/push-controller";
import {CollectorController} from "./collector-controller";


export class Collector {

    private controller: CollectorController;

    public constructor() {
        this.controller = new CollectorController();
    }

    public add(target: string, objects: any[]): void {
        this.controller.add(target, objects);
    }

    public update(target: string, objects: any[]): void {
        this.controller.update(target, objects);
    }

    public remove(target: string, ids: number[] | string[]): void {
        this.controller.remove(target, ids);
    }

    public attach(object_name: string, relation_name: string, object_id: string | number, relation_ids: number[] | string[]): void {
        this.controller.attach(object_name, relation_name, object_id, relation_ids);
    }

    public detach(object_name: string, relation_name: string, object_id: string | number, relation_ids: number[] | string[]): void {
        this.controller.detach(object_name, relation_name, object_id, relation_ids);
    }

    public check(instanceData: InstanceData): CollectorPushResult {
        const pushController = new PushController(this.controller, instanceData);
        return pushController.check();
    }
}