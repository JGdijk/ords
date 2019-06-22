import {Instance} from "./instance";
import {RelationConfig} from "../../../object/relation/relation";

class ModelDecoratorBag {

    private instances: Instance[];

    constructor () {
        this.instances = [];
    }

    private add(name: string): void {
        const instance = new Instance(name);
        this.instances.push(instance);
    }

    public has(target: string): boolean {
        for (const instance of this.instances) {
            if (instance.name === target) { return true; }
        }
        return false;
    }

    public get(target: string): Instance {
        for (const instance of this.instances) {
            if (instance.name === target) { return instance; }
        }
        return null;
    }

    public setPrimaryKey(target: string, primary_key: string): void {
        if (!this.has(target)) { this.add(target); }
        this.get(target).setPrimaryKey(primary_key);
    }

    public addDate(target: string, key: string): void {
        if (!this.has(target)) { this.add(target); }
        this.get(target).addDate(key);
    }

    public addStringifyObject(target: string, key: string): void {
        if (!this.has(target)) { this.add(target); }
        this.get(target).addStringifyObject(key);
    }

    public addRelation(target: string, config: RelationConfig): void {
        if (!this.has(target)) { this.add(target); }
        this.get(target).addRelation(config);
    }

    public setModelStamp(target: string, key: string): void {
        if (!this.has(target)) { this.add(target); }
        this.get(target).setModelStamp(key);
    }

}

export const modelDecoratorBag = new ModelDecoratorBag();