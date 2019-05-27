import {Observable} from "rxjs/internal/Observable";
import {Instance} from "./instance";
import {JoinCallback} from "./statements/join/statements/callback/join-callback";

export interface InstanceInterface {

    find(ids: number | string | number[] | string[]): Observable<any | any[]>;
    first(): Observable<any>;
    get(): Observable<any[]>;
    count(): Observable<number>;

    findStatic(ids: number | string | number[] | string[]): any | any[];
    firstStatic(): any;
    getStatic(): any[];
    countStatic(): number;

    where(key: string | any, action?: string, value?: string | number): Instance;
    orWhere(key: string | any, action?: string, value?: string | number): Instance;
    whereHas(key: string, callback?: any): Instance
    whereDoesntHave(key: string, callback?: any): Instance;

    orderBy(key: string, order: string): Instance;

    with(name: string | string[], joinCallback?: JoinCallback): Instance;

    update(data: any): void;
    remove(ids: number | string | number[] | string[]): void;

}