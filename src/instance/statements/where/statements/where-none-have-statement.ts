import {Relation} from "../../../../object/relation/relation";
import {WhereStatementInterface} from "../where-statement-interface";

export class WhereNoneHaveStatement implements WhereStatementInterface {

    private relation: Relation;

    constructor(relation: Relation) {
        this.relation = relation;
    }

    public check(object: any): boolean {
        //todo maybe better primary key check / error?
        const primary_key = this.relation.getLocalObject().getPrimaryKey();

        if (!object.hasOwnProperty(primary_key)) { return false; }

        return !this.relation.has(object[primary_key]);
    }

    public filter(objects: any[]): any[] {
        for (const object of objects) {
            if (!this.check(object)) { return []; }
        }
        return objects;
    }

    public has(key : string): boolean {
        return (this.relation.getRelationObject().getPrettyName() === key);
    }

    public hasWhereHas(key?: string): boolean { return false; }

    public hasWhereHasComplicated(key: string) { return false; }

    public hasWhereDoesntHave(key?: string): boolean {
        // we have to return true here because
        return true;
    }

    public hasWhereDoesntHaveComplicated(key: string): boolean { return false;}


}
