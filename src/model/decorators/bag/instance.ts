import {RelationConfig} from "../../../object/relation/relation";

export class Instance {

    name: string; // dirty name

    private primary_key: string;

    private dates: string[];

    private stringify_objects: string[];

    private relations: RelationConfig[];

    constructor(name: string) {
        this.name = name.toLowerCase();
        this.dates = [];
        this.stringify_objects = [];
        this.relations = [];
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

}