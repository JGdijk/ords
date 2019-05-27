import {Relation} from "../../../../object/relation/relation";
import {WhereStatementInterface} from "../where-statement-interface";

export class WhereDoesntHaveStatement implements WhereStatementInterface{

    private relation: Relation;

    constructor(relation: Relation) {
        this.relation = relation;
    }

    public has(key : string): boolean {
        return (this.relation.getRelationObject().getModelName() === key);
    }

    public hasWhereHas(key?: string): boolean { return false; }

    public hasWhereHasComplicated(key: string) { return false; }

    public hasWhereDoesntHave(key?: string): boolean {
        if (!key) { return true; }
        return !!(key === this.relation.getModelName());
    }

    public hasWhereDoesntHaveComplicated(key: string): boolean { return false;}

    public check(object: any): boolean {
        //todo maybe better primary key check / error?
        const primary_key = this.relation.getLocalObject().getPrimaryKey();
        if (!object.hasOwnProperty(primary_key)) { return false; }

        return !this.relation.has(object[primary_key]);
    }

    public filter(objects: any[]): any[] {
        return objects.filter((objects: any) => {
            return this.check(objects);
        })
    }


}