import {WhereStatementInterface} from "../../../where-statement-interface";
import {WhereStatementController} from "../../../where-statement-controller";
import {WhereHasStatementCallback} from "../where-has/where-has-statement-callback";
import {WhereStatementCallback} from "./where-statement-callback";
import {RdsObject} from "../../../../../../object/object";

export class WhereStatementCallbackStatement implements WhereStatementInterface{

    private object: RdsObject;

    private whereStatementController: WhereStatementController;

    constructor(callback: any, object: RdsObject) {
        this.object = object;

        this.whereStatementController = new WhereStatementController(this.object);

        this.processCallback(callback);
    }

    public has(key: string): boolean {
        return this.whereStatementController.has(key);
    }

    public hasWhereHas(key?: string): boolean {
        return this.whereStatementController.hasWhereHas(key);
    }

    public hasWhereHasComplicated(key?: string): boolean {
        return this.whereStatementController.hasWhereHasComplicated(key);
    }

    public hasWhereDoesntHave(key?: string): boolean {
        return this.whereStatementController.hasWhereDoesntHave(key);
    }

    public hasWhereDoesntHaveComplicated(key?: string): boolean {
        return this.whereStatementController.hasWhereDoesntHaveComplicated(key);
    }

    public check(object: any): boolean {
        return this.whereStatementController.check(object);
    }

    public filter(objects: any[]): any[] {
        return this.whereStatementController.filter(objects);
    }

    public getWhereStatementController(): WhereStatementController {
        return this.whereStatementController;
    }

    public getObject(): RdsObject {
        return this.object;
    }

    private processCallback(callback: WhereHasStatementCallback): void {
        new WhereStatementCallback(this, callback);
    }

}