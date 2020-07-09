import {Instance} from "./instance";
import {RelationConfig} from "../../../object/relation/relation";

class ModelDecoratorBag {

    private instances: Instance[];

    constructor () {
        this.instances = [];
    }

    private add(model: any): void {
        const instance = new Instance(model);
        this.instances.push(instance);
    }

    public has(target: any): boolean {
        for (const instance of this.instances) {
            if (instance.model === target) { return true; }
        }
        return false;
    }

    public get(target: any): Instance {
        for (const instance of this.instances) {
            if (instance.model === target) { return instance; }
        }
        return null;
    }

    public setPrimaryKey(target: any, primary_key: string): void {
        if (!this.has(target)) { this.add(target); }
        this.get(target).setPrimaryKey(primary_key);
    }

    public addDate(target: any, key: string): void {
        if (!this.has(target)) { this.add(target); }
        this.get(target).addDate(key);
    }

    public addStringifyObject(target: any, key: string): void {
        if (!this.has(target)) { this.add(target); }
        this.get(target).addStringifyObject(key);
    }

    public addRelation(target: any, config: RelationConfig): void {
        if (!this.has(target)) { this.add(target); }
        this.get(target).addRelation(config);
    }

    public setModelStamp(target: any, key: string): void {
        if (!this.has(target)) { this.add(target); }
        this.get(target).setModelStamp(key);
    }

}

export const modelDecoratorBag = new ModelDecoratorBag();
