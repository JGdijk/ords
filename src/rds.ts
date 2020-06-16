import {ObjectContainer} from "./object/object-container";
import {Observable} from "rxjs/index";
import {publish} from "rxjs/operators";
import {Collector} from "./instance/collector/collector";
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

    private hold_externally: boolean;

    private hold_internally: boolean;

    private collector: Collector;

    constructor() {
        this.objectContainer = new ObjectContainer();
        this.initBroadcasting();

        this.hold_externally = false;
        this.hold_internally = false;
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

        // rdsContainer.add(this);
        // console.log(modelDecoratorBag);
        // console.log(this);
    }

    public getObjectContainer(): ObjectContainer {
        return this.objectContainer;
    }

    //todo type
    public add(key: string, objects): void {
        const collector = this.getCollector();
        this.getObjectContainer().find(key).add(objects, collector);
        this.pushChecker(collector);
    }

    public update(key: string, ids: number | string | number[] | string[], data: any): void {
        const collector = this.getCollector();
        this.getObjectContainer().find(key).update(ids, data, collector);
        this.pushChecker(collector);
    }

    public remove(key: string, ids): void {
        const collector = this.getCollector();
        this.getObjectContainer().find(key).remove(ids, collector);
        this.pushChecker(collector);
    }

    public attach(key: string, relation: string, key_ids: string[] | number[], relation_ids: string[] | number[]): void {
        const collector = this.getCollector();
        //todo check if relation exists error?
        if (!this.getObjectContainer().find(key).getRelationContainer().hasByObjectName(relation)) { return; }

        this.getObjectContainer()
            .find(key)
            .getRelationContainer()
            .findByObjectName(relation)
            .attach(key_ids, relation_ids, collector);

        this.pushChecker(collector);
    }

    public detach(key: string, relation: string, key_ids: string[] | number[], relation_ids: string[] | number[]): void {
        const collector = this.getCollector();
        //todo check if relation exists error?
        if (!this.getObjectContainer().find(key).getRelationContainer().hasByObjectName(relation)) { return; }

        this.getObjectContainer()
            .find(key)
            .getRelationContainer()
            .findByObjectName(relation)
            .detach(key_ids, relation_ids, collector);

        this.pushChecker(collector);
    }

    public holdInternally(): void {
        this.hold_internally = true;
    }

    public holdExternally() : void {
        this.hold_externally = true;
    }

    public continueInternally(): void {
        if (!this.hold_internally || this.hold_externally || !this.collector) {
            return;
        }

        this.hold_internally = false;

        this.pushChecker(this.collector);
    }

    public continueExternally(): void {
        if (!this.hold_externally || !this.collector) {
            return;
        }

        this.hold_externally = false;

        this.pushChecker(this.collector);
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

    private getCollector(): Collector {
        if (this.collector) {
            return this.collector;
        }

        const collector = new Collector();

        if (this.pushIsOnHold() && !this.collector) {
            this.collector = collector;
        }

        return collector;
    }

    private pushChecker(collector) {
        if (this.pushIsOnHold()) {
            return;
        }

        this.observer.next(collector);

        if (this.collector) {
            this.collector = null;
        }
    }

    private pushIsOnHold(): boolean {
        return this.hold_internally || this.hold_externally;
    }
}

export var rds = new Rds();
