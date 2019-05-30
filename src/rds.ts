import {ObjectContainer} from "./object/object-container";
import {Observable} from "rxjs/index";
import {publish} from "rxjs/operators";
import {Collector} from "./instance/collector/collector";
import {rdsContainer} from "./rds-container";
import {RelationConfig} from "./object/relation/relation";

export type ModelConfig = {
    name: string,
    model: any,
    primaryKey?: string,
    relations?: RelationConfig[], // todo type
    dates?: any[], // todo type
    stringify?: any[] // todo type
}

export class Rds {

    private objectContainer: ObjectContainer;

    private observer: any; //todo type

    private broadcaster: any; //todo type

    constructor() {
        this.objectContainer = new ObjectContainer();
        this.initBroadcasting();
    }

    public config(configs: ModelConfig[]) {

        // instantiate all the objects
        configs.forEach((config: ModelConfig) => {
            this.objectContainer.add(config, this);
        });

        // instantiate all the relations
        for (const object of this.objectContainer.get()) {
            object.init();
        }

        // for (const object of this.objectContainer.get()) {
        //     object.getRelationContainer().initReverse();
        // }

        rdsContainer.add(this);
        // console.log(modelDecoratorBag);
        // console.log(this);
    }

    public getObjectContainer(): ObjectContainer {
        return this.objectContainer;
    }

    //todo type
    public add(key: string, objects): void {
        const collector = new Collector();
        this.getObjectContainer().find(key).add(objects, collector);
        this.observer.next(collector);
    }

    public update(key: string, ids: number | string | number[] | string[], data: any): void {
        const collector = new Collector();
        this.getObjectContainer().find(key).update(ids, data, collector);
        this.observer.next(collector);
    }

    public remove(key: string, ids): void {
        const collector = new Collector();
        this.getObjectContainer().find(key).remove(ids, collector);
        this.observer.next(collector);
    }

    public attach(key: string, relation: string, key_ids: string[] | number[], relation_ids: string[] | number[]): void {
        const collector = new Collector();
        //todo check if relation exists error?
        if (!this.getObjectContainer().find(key).getRelationContainer().hasByObjectName(relation)) { return; }
        console.log(key);
        console.log(relation);
        console.log(key_ids);
        console.log(relation_ids);
        this.getObjectContainer()
            .find(key)
            .getRelationContainer()
            .findByObjectName(relation)
            .attach(key_ids, relation_ids, collector);
        this.observer.next(collector);
    }

    public detach(key: string, relation: string, key_ids: string[] | number[], relation_ids: string[] | number[]): void {
        const collector = new Collector();
        //todo check if relation exists error?
        if (!this.getObjectContainer().find(key).getRelationContainer().hasByObjectName(relation)) { return; }
        this.getObjectContainer()
            .find(key)
            .getRelationContainer()
            .findByObjectName(relation)
            .detach(key_ids, relation_ids, collector);
        this.observer.next(collector);
    }

    public getBroadcaster(): any { //todo type
        return this.broadcaster;
    }

    private initBroadcasting(): void {
        this.broadcaster = new Observable(observer => {
            this.observer = observer;
        }).pipe( publish() );
        this.broadcaster.connect();
    }
}

export var rds = new Rds();