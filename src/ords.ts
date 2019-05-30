import {ModelConfig, Rds} from "./rds";
import {InstanceController} from "./instance/instance-controller";

export class Ords {

    private rds: Rds;

    public constructor(config: ModelConfig[]) {
        this.rds = new Rds();
        this.rds.config(config);
    }

    public use(name: string): InstanceController {
        return this.rds.getObjectContainer().findPretty(name).instanceController();
    }
}