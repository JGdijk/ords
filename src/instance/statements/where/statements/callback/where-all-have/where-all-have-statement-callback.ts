import {WhereAllHaveStatementCallbackStatement} from "./where-all-have-statement-callback-statement";
import {WhereStatement} from "../../where-statement";
import {WhereBetweenStatement} from "../../where-between-statement";
import {WhereNotBetweenStatement} from "../../where-not-between-statement";
import {WhereInStatement} from "../../where-in-statement";
import {WhereNotInStatement} from "../../where-not-in-statement";
import {WhereHasStatementCallbackStatement} from "../where-has/where-has-statement-callback-statement";
import {WhereHasStatement} from "../../where-has-statement";
import {WhereDoesntHaveStatementCallbackStatement} from "../where-doesnt-have/where-doesnt-have-statement-callback-statement";
import {WhereDoesntHaveStatement} from "../../where-doesnt-have-statement";
import {WhereNoneHaveStatement} from "../../where-none-have-statement";
import {WhereAllHaveStatement} from "../../where-all-have-statement";

export class WhereAllHaveStatementCallback {
    private statement: WhereAllHaveStatementCallbackStatement;

    constructor(statement: WhereAllHaveStatementCallbackStatement, callback: any) {
        this.statement = statement;
        callback(this);
    }

    public where(key: string | any , action?: string, value?: string|number): WhereAllHaveStatementCallback {
        if (action) {
            this.statement.getWhereStatementController().add(new WhereStatement(key, action, value));
        } else {
            this.statement.getWhereStatementController().add(new WhereAllHaveStatementCallbackStatement(key, this.statement.getRelation().getRelationObject()));
        }
        return this;
    }

    public orWhere(key: string | any , action?: string, value?: string|number): WhereAllHaveStatementCallback {
        if (action) {
            this.statement.getWhereStatementController().addNewBag(new WhereStatement(key, action, value));
        } else {
            this.statement.getWhereStatementController().addNewBag(new WhereAllHaveStatementCallbackStatement(key, this.statement.getRelation().getRelationObject()));
        }
        return this;
    }

    public whereBetween(key: string, low: number, high: number): WhereAllHaveStatementCallback {
        this.statement.getWhereStatementController().add(new WhereBetweenStatement(key, low, high));
        return this;
    }

    public whereNotBetween(key: string, low: number, high: number): WhereAllHaveStatementCallback {
        this.statement.getWhereStatementController().add(new WhereNotBetweenStatement(key, low, high));
        return this;
    }

    public whereIn(key: string, values: number[] | string[]): WhereAllHaveStatementCallback {
        this.statement.getWhereStatementController().add(new WhereInStatement(key, values));
        return this;
    }

    public whereNotIn(key: string, values: number[] | string[]): WhereAllHaveStatementCallback {
        this.statement.getWhereStatementController().add(new WhereNotInStatement(key, values));
        return this;
    }

    public whereHas(key: string, callback?: any): WhereAllHaveStatementCallback {
        //todo checks if relation is not found
        const relation = this.statement.getRelation().getRelationObject().getRelationContainer().findByObjectName(key);

        if (callback) {
            this.statement.getWhereStatementController().add(new WhereHasStatementCallbackStatement(relation, callback))
        } else {
            this.statement.getWhereStatementController().add(new WhereHasStatement(relation));
        }

        return this;
    }

    public whereDoesntHave(key: string, callback?: any): WhereAllHaveStatementCallback {
        const relation = this.statement.getRelation().getRelationObject().getRelationContainer().findByObjectName(key);

        if (callback) {
            this.statement.getWhereStatementController().add(new WhereDoesntHaveStatementCallbackStatement(relation, callback))
        } else {
            this.statement.getWhereStatementController().add(new WhereDoesntHaveStatement(relation));
        }

        return this;
    }

    public whereNoneHave(key: string, callback?: any): WhereAllHaveStatementCallback {
        const relation = this.statement.getRelation().getRelationObject().getRelationContainer().findByObjectName(key);

        if (callback) {
            // this.statement.getWhereStatementController().add(new WhereDoesntHaveStatementCallbackStatement(relation, callback))
        } else {
            this.statement.getWhereStatementController().add(new WhereNoneHaveStatement(relation));
        }

        return this;
    }

    public whereAllHave(key: string, callback?: any): WhereAllHaveStatementCallback {
        const relation = this.statement.getRelation().getRelationObject().getRelationContainer().findByObjectName(key);

        if (callback) {
            // this.statement.getWhereStatementController().add(new WhereDoesntHaveStatementCallbackStatement(relation, callback))
        } else {
            this.statement.getWhereStatementController().add(new WhereAllHaveStatement(relation));
        }

        return this;
    }
}