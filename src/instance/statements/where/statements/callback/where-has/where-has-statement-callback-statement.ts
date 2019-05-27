import {WhereStatementInterface} from "../../../where-statement-interface";
import {Relation} from "../../../../../../object/relation/relation";
import {WhereHasStatementCallback} from "./where-has-statement-callback";
import {WhereStatementController} from "../../../where-statement-controller";

export class WhereHasStatementCallbackStatement implements WhereStatementInterface {

    private relation: Relation;

    private whereStatementController: WhereStatementController;

    constructor(relation: Relation, callback: any){
        this.relation = relation;

        this.whereStatementController = new WhereStatementController(this.getRelation().getRelationObject());

        this.processCallback(callback);
    }

    public has(key : string): boolean {
        if (this.relation.getRelationObject().getModelName() === key) { return true; }
        return this.whereStatementController.has(key);
    }

    public hasWhereHas(key?: string): boolean {
        if (!key) { return true; }
        if (key === this.relation.getModelName()) { return true; }
        return this.whereStatementController.has(key);
    }

    public hasWhereHasComplicated(key: string): boolean {
        if (key === this.relation.getModelName()) { return true; }
        return this.whereStatementController.has(key);
    }

    public hasWhereDoesntHave(key?: string): boolean {
        return this.getWhereStatementController().hasWhereDoesntHave(key);
    }

    public hasWhereDoesntHaveComplicated(key: string): boolean {
        return this.getWhereStatementController().hasWhereDoesntHaveComplicated(key);
    }


    public check(object: any): boolean {
        //todo maybe better primary key check / error?
        const primary_key = this.relation.getLocalObject().getPrimaryKey();
        if (!object.hasOwnProperty(primary_key)) { return false; }

        if (!this.relation.has(object[primary_key])) { return false }

        let relation = this.relation.findByObject(object);

        if (this.relation.returnsMany()) {
            relation = this.whereStatementController.filter(relation);
            return (relation.length > 0);
        } else {
            return this.whereStatementController.check(relation);
        }
    }

    public filter(objects: any[]): any[] {
        return objects.filter((object: any) => {
            return this.check(object);
        })
    }

    public getWhereStatementController(): WhereStatementController {
        return this.whereStatementController;
    }

    public getRelation(): Relation {
        return this.relation;
    }

    private processCallback(callback: WhereHasStatementCallback): void {
        new WhereHasStatementCallback(this, callback);
    }
}