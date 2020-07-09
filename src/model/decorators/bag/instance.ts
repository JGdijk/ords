import {RelationConfig} from "../../../object/relation/relation";

export class Instance {

    public model: any;

    private primary_key: string;

    private dates: string[];

    private stringify_objects: string[];

    private relations: RelationConfig[];

    private model_stamp: string;

    constructor(model: any) {
        this.model = model;
        this.dates = [];
        this.stringify_objects = [];
        this.relations = [];
    }

    public hasPrimaryKey(): boolean {
        return !!(this.primary_key);
    }

    public setPrimaryKey(primary_key: string): void {
        this.primary_key = primary_key;
    }

    public getPrimaryKey(): string {
        return this.primary_key;
    }

    public addDate(key: string): void {
        this.dates.push(key);
    }

    public getDates(): string[] {
        return this.dates;
    }

    public addStringifyObject(key: string): void {
        this.stringify_objects.push(key);
    }

    public getStringifyObjects(): string[] {
        return this.stringify_objects;
    }

    public addRelation(relationConfig: RelationConfig): void {
        this.relations.push(relationConfig);
    }

    public getRelations(): RelationConfig[] {
        return this.relations;
    }

    public hasModelStamp(): boolean {
        return !!(this.model_stamp);
    }

    public setModelStamp(key: string): void {
        this.model_stamp = key;
    }

    public getModelStamp(): string {
        return this.model_stamp;
    }

}
