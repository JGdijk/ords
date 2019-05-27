import {WhereStatementInterface} from "../where-statement-interface";
import {Relation} from "../../../../object/relation/relation";

export class WhereHasStatement implements WhereStatementInterface {

    private relation: Relation;

    constructor(relation: Relation) {
        this.relation = relation;
    }

    public check(object: any): boolean {
        //todo maybe better primary key check / error?
        const primary_key = this.relation.getLocalObject().getPrimaryKey();
        if (!object.hasOwnProperty(primary_key)) { return false; }

        return this.relation.has(object[primary_key]);
    }

    public filter(objects: any[]): any[] {
        return objects.filter((objects: any) => {
            return this.check(objects);
        })
    }

    public has(key : string): boolean {
        return (this.relation.getRelationObject().getModelName() === key);
    }

    public hasWhereHas(key?: string): boolean {
        if (!key) { return true; }
        return !!(key === this.relation.getModelName());
    }

    public hasWhereHasComplicated(key: string) { return false; }

    public hasWhereDoesntHave(key?: string): boolean { return false; }

    public hasWhereDoesntHaveComplicated(key: string): boolean { return false;}
}