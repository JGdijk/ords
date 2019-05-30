import {InstanceInterface} from "./instance.interface";
import {Rds} from "../rds";
import {RdsObject} from "../object/object";
import {Instance} from "./instance";
import {Observable} from "rxjs/internal/Observable";
import {WhereInStatement} from "./statements/where/statements/where-in-statement";

export class InstanceController implements InstanceInterface {

    private object: RdsObject;

    private rds: Rds;

    constructor(rds: Rds, object: RdsObject) {
        this.rds = rds;
        this.object = object;
    }

    /*************************** retrieving ***************************
     ******************************************************************/

    public find(ids: number | string | number[] | string[]): Observable<any> {
        return this.getInstance().find(ids);
    }

    public first(): Observable<any> {
        return this.getInstance().first();
    }

    public get(): Observable<any> {
        return this.getInstance().get();
    }

    public getIds(): Observable<any> {
        return this.getInstance().getIds();
    }

    public count(): Observable<any> {
        return this.getInstance().count();
    }

    // static
    public findStatic(ids: number | string | number[] | string[]): any {
        return this.getInstance().findStatic(ids);
    }

    public firstStatic(): any {
        return this.getInstance().firstStatic()
    }

    public getStatic(): any {
        return this.getInstance().getStatic()
    }

    public getIdsStatic(): any {
        return this.getInstance().getIdsStatic();
    }

    public countStatic(): any {
        return this.getInstance().countStatic()
    }

    /*************************** where statements ***************************
     ******************************************************************/

    public where(key: string | any, action?: string, value?: string|number): Instance {
        return this.getInstance().where(key, action, value);
    }

    public orWhere(key: string | any, action?: string, value?: string|number): Instance {
        return this.getInstance().orWhere(key, action, value);
    }

    public whereBetween(key: string, low: number, high: number): Instance {
        return this.getInstance().whereBetween(key, low, high);
    }

    public whereNotBetween(key: string, low: number, high: number): Instance {
        return this.getInstance().whereNotBetween(key, low, high);
    }

    public whereIn(key: string, values: number[] | string[]): Instance {
        return this.getInstance().whereIn(key, values);
    }

    public whereNotIn(key: string, values: number[] | string[]): Instance {
        return this.getInstance().whereNotIn(key, values);
    }

    public whereExists(key: string): Instance {
        return this.getInstance().whereExists(key);
    }

    public whereNotExists(key: string): Instance {
        return this.getInstance().whereNotExists(key);
    }

    public whereEmpty(key: string): Instance {
        return this.getInstance().whereEmpty(key);
    }

    public whereNotEmpty(key: string): Instance {
        return this.getInstance().whereNotEmpty(key);
    }

    public whereHas(key: string, callback?: any): Instance {
        return this.getInstance().whereHas(key, callback);
    }

    public whereDoesntHave(key: string, callback?: any): Instance {
        return this.getInstance().whereDoesntHave(key, callback);
    }

    /*************************** ordery by ***************************
     ******************************************************************/

    public orderBy(key: string, order?: string): Instance {
        return this.getInstance().orderBy(key, order);
    }

    /*************************** join ***************************
     ******************************************************************/

    public with(name: string | string[], callback?: any): Instance { //fix type
        return this.getInstance().with(name, callback);
    }

    /*************************** direct actions ***************************
     ******************************************************************/

    //

    public add(objects: any | any[]): void {
        this.rds.add(this.object.getModelName(), objects);
    }

    public update(data: any, ids ?: number | string | number[] | string[]): void {
        this.getInstance().update(data, ids);
    }

    public remove(ids?: number | string | number[] | string): void {
        this.getInstance().remove(ids);
    }

    public attach(relation_name: string,
                  relation_ids: number | string | number[] | string[]): void {
        this.getInstance().attach(relation_name, relation_ids);
    }

    public detach(relation_name: string,
                  relation_ids?: number | string | number[] | string[]): void {
        this.getInstance().detach(relation_name, relation_ids);
    }


    /*************************** helpers ***************************
     ******************************************************************/

    private getInstance(): Instance {
        return new Instance(this.rds, this.object);
    }
}