import {Relation} from "../../../../../../object/relation/relation";
import {WhereStatementController} from "../../../where-statement-controller";
import {WhereStatementInterface} from "../../../where-statement-interface";
import {WhereNoneHaveStatementCallback} from "./where-none-have-statement-callback";

export class WhereNoneHaveStatementCallbackStatement implements WhereStatementInterface {

    private relation: Relation;

    private whereStatementController: WhereStatementController;

    constructor(relation: Relation, callback: any) {
        this.relation = relation;

        this.whereStatementController = new WhereStatementController(this.getRelation().getRelationObject());

        this.processCallback(callback);
    }

    public check(object: any): boolean {
        let relationObjects = this.relation.findByObject(object);

        if (this.relation.returnsMany()) {
            if (!relationObjects.length) { return true; }
            const filtered_RelationObjects = this.whereStatementController.filter(relationObjects);
            if (!filtered_RelationObjects.length) { return true; }
        } else {
            if (!relationObjects) { return true; }
            if (!this.whereStatementController.check(relationObjects)) { return true; }
        }

        return false;
    }

    public filter(objects: any[]): any[] {
        for (const object of objects) {
            if (!this.check(object)) { return []; }
        }
        return objects;
    }

    public has(key : string): boolean {
        if (this.relation.getRelationObject().getModelName() === key) { return true; }
        return this.whereStatementController.has(key);
    }

    public hasWhereHas(key?: string): boolean {
        return this.whereStatementController.hasWhereHas(key);
    }

    public hasWhereHasComplicated(key: string): boolean {
        return this.whereStatementController.hasWhereHasComplicated(key);
    }

    public hasWhereDoesntHave(key?: string): boolean {
        return true; // todo think about this.
    }

    public hasWhereDoesntHaveComplicated(key: string): boolean {
        return true; // todo think about this.
    }

    public getWhereStatementController(): WhereStatementController {
        return this.whereStatementController;
    }

    public getRelation(): Relation {
        return this.relation;
    }

    private processCallback(callback: WhereNoneHaveStatementCallback): void {
        new WhereNoneHaveStatementCallback(this, callback);
    }

}