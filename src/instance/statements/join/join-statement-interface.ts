import {Relation} from "../../../object/relation/relation";
import {WhereStatementController} from "../where/where-statement-controller";
import {OrderByStatementController} from "../orderby/order-by-statement-controller";
import {JoinStatementController} from "./join-statement-controller";

export interface JoinStatementInterface {
    attach(object: any): void;
    has(key: string): boolean;
    getRelation(): Relation;
    hasStatements(): boolean;
    getStatements(): JoinStatementInterface[];
    hasWhereStatements(): boolean;
    getWhereStatementController(): WhereStatementController;
    hasOrderByStatements(): boolean;
    getOrderByStatementController(): OrderByStatementController;
    getJoinStatementController(): JoinStatementController;
}