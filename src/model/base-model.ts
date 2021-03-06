import {rdsContainer} from "../rds-container";

export class BaseModel {
    constructor(data, rds) {
        if (data) {
            Object.assign(this, data);
        }

        rds = (rds)
            ? rds
            : rdsContainer.first();

        // this.detach = (relation: string, ids?: number | string | number[] | string[]): void => {
        //     console.log('hier');
        //     const funcNameRegex = /function (.{1,})\(/;
        //     let name = (funcNameRegex).exec(this.constructor.toString())[1].toLowerCase();
        //
        //     let ids_array = [];
        //
        //     if (!ids) { ids_array = ['*']}
        //     else if (ids === '*') { ids_array = ['*']}
        //     else if (!Array.isArray(ids)) { ids_array = [ids]; }
        //     else { ids_array = ids; }
        //
        //     console.log(this);
        //     rds.detach(
        //         name,
        //         relation,
        //         [this[rds.getObjectContainer().find(name).getPrimaryKey()]],
        //         ids_array
        //     );
        // };
    }

    public save(): void {}
    public update(data: any): void {}
    public remove(): void {}
    public attach(relation: string, ids?: number | string | number[] | string[]): void {}
    public detach(relation: string, ids?: number | string | number[] | string[]): void {}
}