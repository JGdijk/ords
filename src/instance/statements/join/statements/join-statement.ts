import {Relation} from "../../../../object/relation/relation";
import {JoinStatementInterface} from "../join-statement-interface";
import {WhereStatementController} from "../../where/where-statement-controller";
import {OrderByStatementController} from "../../orderby/order-by-statement-controller";

export class JoinStatement implements JoinStatementInterface {

    private relation: Relation;

    constructor(relation: Relation) {
        this.relation = relation;
    }

    attach(object: any): void {
        object[this.relation.getObjectName()] = this.relation.findByObject(object, true);
    }

    has(key: string): boolean {
        return !!(key === this.relation.getModelName());
    }

    getRelation(): Relation {
        return this.relation;
    }

    hasStatements(): boolean { return false; }
    getStatements(): JoinStatementInterface[] { return []; }
    hasWhereStatements(): boolean { return false; }
    getWhereStatementController(): WhereStatementController { return null; }
    hasOrderByStatements(): boolean { return false; }
    getOrderByStatementController(): OrderByStatementController { return null; }
}