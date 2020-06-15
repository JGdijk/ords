import {ModelConfig, Rds} from "./rds";
import {InstanceController} from "./instance/instance-controller";

export class Ords {

    private rds: Rds;

    public constructor(config?: ModelConfig[]) {
        this.rds = new Rds();

        if (config) {
            this.rds.config(config);
        }
    }

    public addConfigs(config: ModelConfig[]) {
        this.rds.config(config);
    }

    public use(name: string): InstanceController {
        return this.rds.getObjectContainer().findPretty(name).instanceController();
    }

    public hold(): void {
        this.rds.holdExternally();
    }

    public continue(): void {
        this.rds.continueExternally();
    }
}
