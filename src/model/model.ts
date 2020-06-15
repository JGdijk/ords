
import {Rds} from "../rds";

export class Model {

    constructor(data ?: any) {
        if (data) {
            Object.assign(this, data);
        }
    }

    public update(data: any): void {}

    public remove(): void {}

    public attach(relation: string, ids?: number | string | number[] | string[]): void {}

    public detach(relation: string, ids?: number | string | number[] | string[]): void {}

    public addRelation(relation: string, object: any | any[]): void {}
}
