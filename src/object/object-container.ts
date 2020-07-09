import {RdsObject} from "./object";
import {ModelConfig} from "../rds";

export class ObjectContainer {

    private objects: RdsObject[];

    constructor () {
        this.objects = [];
    }

    public add(config: ModelConfig, rds): void {
        const newObject = new RdsObject(config, rds);
        this.objects.push(newObject);
    }

    // public has(name: string) {
    //     for (const object of this.objects) {
    //         if (name === object.getModelName()) { return true; }
    //     }
    //     return false;
    // }

    public hasPretty(name: string) {

        name = name.toLowerCase();

        for (const object of this.objects) {
            if (name === object.getPrettyName()) { return true; }
        }
        return false;
    }

    public get(): RdsObject[] {
        return this.objects;
    }

    // public find(name: string): RdsObject | null {
    //
    //     // name = name.toLowerCase();
    //
    //     for (const object of this.objects) {
    //         if (name === object.getModelName()) { return object; }
    //     }
    //     return null;
    // }

    public findPretty(name: string): RdsObject {

        name = name.toLowerCase();

        for (const object of this.objects) {
            if (name === object.getPrettyName()) { return object; }
        }
        return null;
    }

}
