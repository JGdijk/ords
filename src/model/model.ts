
// todo we would like to remove rds from it.
import {rdsContainer} from "../rds-container";

export class Model{
    constructor(data ?: any) {
        if (data) {
            Object.assign(this, data);
        }
    }

    public update(data: any): void {
        // const key = this.constructor.name;
        // const rds = rdsContainer.first();
        // const object = rds.getObjectContainer().find(key);
        //
        // if (!this.hasOwnProperty(object.getPrimaryKey())) {
        //     // todo error can't update
        //     return;
        // }
        // if (!object.has(this[object.getPrimaryKey()])) {
        //     // todo error object doesn't exist
        //     return;
        // }
        //
        // rds.update(key, this[object.getPrimaryKey()], data);
    }

    public remove(): void {
        // const key = this.constructor.name;
        // const rds = rdsContainer.first();
        // const object = rds.getObjectContainer().find(key);
        //
        // if (!this.hasOwnProperty(object.getPrimaryKey())) {
        //     // todo error can't update
        //     return;
        // }
        // if (!object.has(this[object.getPrimaryKey()])) {
        //     // todo error object doesn't exist
        //     return;
        // }
        //
        // rds.remove(key, this[object.getPrimaryKey()]);
    }

    public attach(relation: string, ids?: number | string | number[] | string[]): void {
        // const key = this.constructor.name;
        // const rds = rdsContainer.first();
        // const object = rds.getObjectContainer().find(key);
        //
        // if (!this.hasOwnProperty(object.getPrimaryKey())) {
        //     // todo error can't update
        //     return;
        // }
        // if (!object.has(this[object.getPrimaryKey()])) {
        //     // todo error object doesn't exist
        //     return;
        // }
        //
        // const ids_array: any = (!Array.isArray(ids)) ? [ids] : ids;
        //
        // rds.attach(
        //     key,
        //     relation,
        //     [this[object.getPrimaryKey()]],
        //     ids_array
        // )
    }

    public detach(relation: string, ids?: number | string | number[] | string[]): void {
        // const key = this.constructor.name;
        // const rds = rdsContainer.first();
        // const object = rds.getObjectContainer().find(key);
        //
        // if (!this.hasOwnProperty(object.getPrimaryKey())) {
        //     // todo error can't update
        //     return;
        // }
        // if (!object.has(this[object.getPrimaryKey()])) {
        //     // todo error object doesn't exist
        //     return;
        // }
        //
        // const ids_array: any = (!Array.isArray(ids)) ? [ids] : ids;
        //
        // rds.detach(
        //     key,
        //     relation,
        //     [this[object.getPrimaryKey()]],
        //     ids_array
        // )
    }
}