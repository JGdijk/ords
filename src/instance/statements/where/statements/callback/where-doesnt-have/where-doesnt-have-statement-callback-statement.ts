import {WhereStatementInterface} from "../../../where-statement-interface";
import {Relation} from "../../../../../../object/relation/relation";
import {WhereDoesntHaveStatementCallback} from "./where-doesnt-have-statement-callback";
import {WhereStatementController} from "../../../where-statement-controller";

export class WhereDoesntHaveStatementCallbackStatement implements WhereStatementInterface {

    private relation: Relation;

    private whereStatementController: WhereStatementController;

    constructor(relation: Relation, callback: any){
        this.relation = relation;

        this.whereStatementController = new WhereStatementController(this.getRelation().getRelationObject());

        this.processCallback(callback);
    }

    public has(key: string): boolean {
        if (this.relation.getModelName() === key) { return true; }
        return !!(this.getWhereStatementController().has(key));
    }

    public hasWhereHas(key?: string): boolean {
        return this.getWhereStatementController().hasWhereHas(key);
    }

    public hasWhereHasComplicated(key: string): boolean {
        return this.getWhereStatementController().hasWhereHasComplicated(key);
    }

    public hasWhereDoesntHave(key?: string): boolean {
        if (!key) { return true; }
        if (key === this.relation.getModelName()) { return true; }
        return this.whereStatementController.has(key);
    }

    public hasWhereDoesntHaveComplicated(key: string): boolean {
        if (key === this.relation.getModelName()) { return true; }
        return this.whereStatementController.has(key);
    }

    public check(object: any): boolean {
        //todo maybe better primary key check / error?
        const primary_key = this.relation.getLocalObject().getPrimaryKey();
        if (!object.hasOwnProperty(primary_key)) { return false; }

        if (!this.relation.has(object[primary_key])) { return true; }

        let relation = this.relation.findByObject(object);

        if (this.relation.returnsMany()) {
            relation = this.whereStatementController.filter(relation);
            return (relation.length === 0);
        } else {
            return !this.whereStatementController.check(relation);
        }
    }

    public filter(objects: any[]): any[] {
        return objects.filter((objects: any) => {
            return this.check(objects);
        })
    }

    public getRelation(): Relation {
        return this.relation;
    }

    public getWhereStatementController(): WhereStatementController {
        return this.whereStatementController;
    }

    processCallback(callback: WhereDoesntHaveStatementCallback): void {
        new WhereDoesntHaveStatementCallback(this, callback);
    }
}