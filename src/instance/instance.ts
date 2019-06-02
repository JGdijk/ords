import {Rds} from "../rds";
import {RdsObject} from "../object/object";
import {InstanceInterface} from "./instance.interface";
import {Observable} from "rxjs/internal/Observable";
import {InstanceDataController} from "./data/instance-data-controller";
import {WhereStatement} from "./statements/where/statements/where-statement";
import {OrderByStatement} from "./statements/orderby/order-by-statement";
import {JoinStatement} from "./statements/join/statements/join-statement";
import {JoinCallbackStatement} from "./statements/join/statements/callback/join-callback-statement";
import {WhereStatementCallbackStatement} from "./statements/where/statements/callback/where/where-statement-callback-statement";
import {WhereHasStatement} from "./statements/where/statements/where-has-statement";
import {WhereHasStatementCallbackStatement} from "./statements/where/statements/callback/where-has/where-has-statement-callback-statement";
import {WhereDoesntHaveStatement} from "./statements/where/statements/where-doesnt-have-statement";
import {WhereDoesntHaveStatementCallbackStatement} from "./statements/where/statements/callback/where-doesnt-have/where-doesnt-have-statement-callback-statement";
import {WhereBetweenStatement} from "./statements/where/statements/where-between-statement";
import {WhereNotBetweenStatement} from "./statements/where/statements/where-not-between-statement";
import {WhereInStatement} from "./statements/where/statements/where-in-statement";
import {WhereNotInStatement} from "./statements/where/statements/where-not-in-statement";
import {WhereExistsStatement} from "./statements/where/statements/where-exists-statement";
import {WhereNotExistsStatement} from "./statements/where/statements/where-not-exists-statement";
import {WhereEmptyStatement} from "./statements/where/statements/where-empty-statement";
import {WhereNotEmptyStatement} from "./statements/where/statements/where-not-empty-statement";

export class Instance implements InstanceInterface {

    private rds: Rds;

    private object: RdsObject;

    private dataController: InstanceDataController;

    constructor(rds: Rds, object: RdsObject) {
        this.rds = rds;
        this.object = object;

        this.dataController = new InstanceDataController(rds, object);
    }

    /*************************** retrieving ***************************
     ******************************************************************/

    public find(ids: number | string | number[] | string[]): Observable<any> {
        return this.dataController.find(ids);
    }

    public first(): Observable<any> {
        return this.dataController.first()
    }

    public get(): Observable<any> {
        return this.dataController.get()
    }

    public getIds(): Observable<any> {
        return this.dataController.getIds();
    }

    public count(): Observable<any> {
        return this.dataController.count()
    }

    // static

    public findStatic(ids: number | string | number[] | string[]): any {
        return this.dataController.findStatic(ids);
    }

    public firstStatic(): any {
        return this.dataController.firstStatic()
    }

    public getStatic(): any {
        return this.dataController.getStatic()
    }

    public getIdsStatic(): any {
        return this.dataController.getIdsStatic();
    }

    public countStatic(): any {
        return this.dataController.countStatic()
    }

    /*************************** where statements ***************************
     ******************************************************************/

    public where(key: string | any , action?: string, value?: string|number): Instance {
        if (action) {
            this.dataController.getInstanceData().getWhereStatementController().add(new WhereStatement(key, action, value));
        } else {
            this.dataController.getInstanceData().getWhereStatementController().add(new WhereStatementCallbackStatement(key, this.object));
        }
        return this;
    }


    public orWhere(key: string | any , action?: string, value?: string|number): Instance {
        if (action) {
            this.dataController.getInstanceData().getWhereStatementController().addNewBag(new WhereStatement(key, action, value));
        } else {
            this.dataController.getInstanceData().getWhereStatementController().addNewBag(new WhereStatementCallbackStatement(key, this.object));
        }
        return this;
    }

    public whereBetween(key: string, low: number, high: number): Instance {
        this.dataController.getInstanceData().getWhereStatementController().add(new WhereBetweenStatement(key, low, high));
        return this;
    }

    public whereNotBetween(key: string, low: number, high: number): Instance {
        this.dataController.getInstanceData().getWhereStatementController().add(new WhereNotBetweenStatement(key, low, high));
        return this;
    }

    public whereIn(key: string, values: number[] | string[]): Instance {
        this.dataController.getInstanceData().getWhereStatementController().add(new WhereInStatement(key, values));
        return this;
    }

    public whereNotIn(key: string, values: number[] | string[]): Instance {
        this.dataController.getInstanceData().getWhereStatementController().add(new WhereNotInStatement(key, values));
        return this;
    }

    public whereExists(key: string): Instance {
        this.dataController.getInstanceData().getWhereStatementController().add(new WhereExistsStatement(key));
        return this;
    }

    public whereNotExists(key: string): Instance {
        this.dataController.getInstanceData().getWhereStatementController().add(new WhereNotExistsStatement(key));
        return this;
    }

    public whereEmpty(key: string): Instance {
        this.dataController.getInstanceData().getWhereStatementController().add(new WhereEmptyStatement(key));
        return this;
    }

    public whereNotEmpty(key: string): Instance {
        this.dataController.getInstanceData().getWhereStatementController().add(new WhereNotEmptyStatement(key));
        return this;
    }
    // todo where on dates

    public whereHas(key: string, callback?: any): Instance {
        //todo checks if relation is not found
        const relation = this.object.getRelationContainer().findByObjectName(key);

        if (callback) {
            this.dataController.getInstanceData().getWhereStatementController().add(new WhereHasStatementCallbackStatement(relation, callback))
        } else {
            this.dataController.getInstanceData().getWhereStatementController().add(new WhereHasStatement(relation));
        }

        return this;
    }

    public whereDoesntHave(key: string, callback?: any): Instance {
        const relation = this.object.getRelationContainer().findByObjectName(key);

        if (callback) {
            this.dataController.getInstanceData().getWhereStatementController().add(new WhereDoesntHaveStatementCallbackStatement(relation, callback))
        } else {
            this.dataController.getInstanceData().getWhereStatementController().add(new WhereDoesntHaveStatement(relation));
        }

        return this;
    }


    /*************************** order by ***************************
     ******************************************************************/

    public orderBy(key: string, order?: string): Instance {
        this.dataController.getInstanceData().getOrderByStatementController().add(new OrderByStatement(key, order));
        return this;
    }

    /*************************** join ***************************
     ******************************************************************/

    public with(name: string | string[], callback?: any): Instance { //todo fix type
        if (callback && !Array.isArray(name)) {
            if (!this.object.getRelationContainer().hasByObjectName(name)) { return this; }
            const relation = this.object.getRelationContainer().findByObjectName(name);
            this.dataController.getInstanceData().getJoinStatementController().add(new JoinCallbackStatement(relation, callback))
        } else {
            if (!Array.isArray(name)) {
                if (!this.object.getRelationContainer().hasByObjectName(name)) { return this; }
                const relation = this.object.getRelationContainer().findByObjectName(name);
                this.dataController.getInstanceData().getJoinStatementController().add(new JoinStatement(relation));
            } else {
                for (const v of name ) {
                    if (!this.object.getRelationContainer().hasByObjectName(v)) { return this; }
                    const relation = this.object.getRelationContainer().findByObjectName(v);
                    this.dataController.getInstanceData().getJoinStatementController().add(new JoinStatement(relation));
                }
            }
        }
        return this;
    }


    /*************************** direct actions ***************************
     ******************************************************************/

    public update(data: any, ids_in?: number | string | number[] | string[]): void {

        let ids = null;
        if (ids_in) {
            if (!Array.isArray(ids_in)) {
                ids = [ids_in];
            } else {
                ids = ids_in;
            }
        }

        let objects: any[] = this.object.get();

        objects = this.dataController.getInstanceData().getWhereStatementController().filter(objects);

        let object_ids: number[] = [];

        for (const object of objects) {
            if (ids && ids.length) {
                if (!ids.includes(object[this.object.getPrimaryKey()])) { continue; }
            }
            object_ids.push(object[this.object.getPrimaryKey()]);
        }

        this.rds.update(this.object.getModelName(), object_ids, data);
    }

    public remove(ids_in?: number | string | number[] | string): void {

        let ids = null;

        if (ids_in) {
            if (!Array.isArray(ids_in)) {
                ids = [ids_in];
            } else {
                ids = ids_in;
            }
        }

        // todo if where statement controller doesn't have anything

        if (!this.dataController.getInstanceData().getWhereStatementController().has()) {
            if (!ids) {
                // throw error
                return;
            }
            this.rds.remove(this.object.getModelName(), ids);
        }

        let objects: any[] = this.object.get();

        objects = this.dataController.getInstanceData().getWhereStatementController().filter(objects);
        let object_ids: number[] = [];

        for (const object of objects) {
            if (ids && ids.length) {
                if (!ids.includes(object[this.object.getPrimaryKey()])) { continue; }
            }
            object_ids.push(object[this.object.getPrimaryKey()]);
        }

        this.rds.remove(this.object.getModelName(), object_ids);
    }

    public attach(ids: number | string | number[] | string[],
                  relation_name: string,
                  relation_ids: number | string | number[] | string[]): void {

        const relation_ids_array: any = (Array.isArray(relation_ids))
            ? relation_ids
            : [relation_ids];

        const object_ids_array: any[] = (Array.isArray(ids)) ? ids : [ids];

        this.rds.attach(this.object.getModelName(), relation_name, object_ids_array, relation_ids_array);
    }

    public detach(ids: number | string | number[] | string[],
                  relation_name: string,
                  relation_ids: number | string | number[] | string[]): void {

        let relation_ids_array = null;
        if (!relation_ids || relation_ids === '*') {
            relation_ids_array = ['*']
        } else {
            relation_ids_array = (Array.isArray(relation_ids))
                ? relation_ids
                : [relation_ids];
        }

        const object_ids_array: any[] = (Array.isArray(ids)) ? ids : [ids];

        this.rds.detach(this.object.getModelName(), relation_name, object_ids_array, relation_ids_array);
    }

}