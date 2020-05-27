import {Observable} from "rxjs/internal/Observable";
import {InstanceData} from "./instance-data";
import {filter, map, startWith} from "rxjs/operators";
import {Rds} from "../../rds";
import {RdsObject} from "../../object/object";
import {Collector} from "../collector/collector";

export class InstanceDataController {

    private data: InstanceData;

    private returnType: string;

    private observer: boolean;

    private rds: Rds;

    constructor(rds: Rds, object: RdsObject) {
        this.data = new InstanceData(object);
        this.rds = rds;

        this.observer = true;
    }

    /*************************** retrieving ***************************
     ******************************************************************/

    public find(ids: number | string | number[] | string[]): Observable<any> {
        this.returnType = 'find';
        this.data.setIds(ids);
        return this.results();
    }

    public first(): Observable<any> {
        this.returnType = 'first';
        return this.results();
    }

    public get(): Observable<any> {
        this.returnType = 'get';
        return this.results();
    }

    public getIds(): Observable<number[]> {
        this.returnType = 'getids';
        return this.results();
    }

    public count(): Observable<any> {
        this.returnType = 'count';
        return this.results();
    }

    // static functions

    public findStatic(ids: number | string | number[] | string[]): any {
        this.returnType = 'find';
        this.data.setIds(ids);
        return this.returnData();
    }

    public firstStatic(): any {
        this.returnType = 'first';
        return this.returnData();
    }

    public getStatic(): any {
        this.returnType = 'get';
        return this.returnData();
    }

    public getIdsStatic(): number[] {
        this.returnType = 'getids';
        return this.returnData();
    }

    public countStatic(): Observable<any> {
        this.returnType = 'count';
        return this.returnData();
    }

    private results(): Observable<any> | any {
        if (!this.observer) {
            return this.returnData();
        } else {
            return this.rds.getBroadcaster()
                .pipe(
                    startWith(null),
                    filter((collector: Collector) => {
                        return (!collector)
                            ? true
                            : this.push(collector);
                    }),
                    map(() => this.returnData())

                );
        }
    }

    private returnData(): Observable<any> | any {
        switch (this.returnType) {
            case 'find':
                return this.data.first();
            case 'first':
                return this.data.first();
            case 'get':
                return this.data.get();
            case 'getids':
                return this.data.getDataIds();
            case 'count':
                return this.data.get().length;
        }
    }

    public getInstanceData(): InstanceData {
        return this.data;
    }

    private push(collector: Collector): boolean {

        const collectorCheckResult = collector.check(this.data);

        if (collectorCheckResult.shouldPush()) {
            this.getInstanceData().set(collectorCheckResult.getData());
            return true;
        }
        return false;
    }

}
