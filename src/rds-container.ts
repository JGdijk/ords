import {Rds} from "./rds";

class RdsContainer {

    private instances = [];

    public add (rds: Rds): void {
        this.instances.push(rds);
    }

    public first(): Rds {
        // todo error on empty
        return this.instances[0];
    }

}

export const rdsContainer = new RdsContainer();