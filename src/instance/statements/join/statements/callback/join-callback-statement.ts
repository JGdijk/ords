import {Relation} from "../../../../../object/relation/relation";
import {WhereStatementController} from "../../../where/where-statement-controller";
import {OrderByStatementController} from "../../../orderby/order-by-statement-controller";
import {JoinStatementController} from "../../join-statement-controller";
import {JoinCallback} from "./join-callback";
import {JoinStatementInterface} from "../../join-statement-interface";

export class JoinCallbackStatement implements JoinStatementInterface {

    private relation: Relation;

    private orderByStatementController: OrderByStatementController;
    private joinStatementController: JoinStatementController;
    private whereStatementController: WhereStatementController;

    constructor(relation: Relation, callback: JoinCallback) {
        this.relation = relation;

        this.orderByStatementController = new OrderByStatementController(relation.getRelationObject().getPrimaryKey());
        this.joinStatementController = new JoinStatementController();
        this.whereStatementController = new WhereStatementController(this.relation.getRelationObject());

        this.processCallback(callback);
    }

    public attach(object: any): void {


        let relation_objects = this.relation.findByObject(object);

        // Returns if null or []
        if ((!this.relation.returnsMany() && !relation_objects) || (this.relation.returnsMany() && !relation_objects.length)) {
            Object.defineProperty(object, this.relation.getObjectName(), {
                value: relation_objects,
                enumerable: true
            })
            return;
        }

        if (!this.relation.returnsMany()) {
            // If the relation doesn't pass the where statement return null.
            if (this.whereStatementController.has() && !this.getWhereStatementController().check(relation_objects)) {
                Object.defineProperty(object, this.relation.getObjectName(), {
                    value: null,
                    enumerable: true
                })
                return;
            }

            let model = this.relation.getRelationObject().createModel(relation_objects);

            if (this.getJoinStatementController().has()) {
                this.getJoinStatementController().attach(model);
            }

            Object.defineProperty(object, this.relation.getObjectName(), {
                value: model,
                enumerable: true
            })

            return;

        } else {
            if (this.whereStatementController.has()) {
                relation_objects = this.getWhereStatementController().filter(relation_objects);
            }

            let models = [];
            for (const obj of relation_objects) {
                models.push(this.relation.getRelationObject().createModel(obj));
            }

            if (this.orderByStatementController.has()) {
                models = this.getOrderByStatementController().order(models);
            }

            if (this.getJoinStatementController().has()) {
                this.getJoinStatementController().attachMany(models);
            }

            Object.defineProperty(object, this.relation.getObjectName(), {
                value: models,
                enumerable: true
            })

            return;
        }
    }

    public has(key: string): boolean {
        if (key === this.getRelation().getPrettyName()) { return true; }
        if (this.getJoinStatementController().has(key)) { return true; }
        return !!(this.getWhereStatementController().has(key));
    }

    public hasStatements(key?: string): boolean {
        return !!(this.getJoinStatementController().has());
    }

    public getStatements(): JoinStatementInterface[] {
        return this.getJoinStatementController().getStatements();
    }

    private processCallback(callback: JoinCallback): void {
        new JoinCallback(this, callback);
    }

    public hasWhereStatements(): boolean {
        return this.getWhereStatementController().has();
    }

    public hasOrderByStatements(): boolean {
        return this.getOrderByStatementController().has();
    }

    public getOrderByStatementController(): OrderByStatementController {
        return this.orderByStatementController;
    }
    public getJoinStatementController(): JoinStatementController {
        return this.joinStatementController;
    }
    public getWhereStatementController(): WhereStatementController {
        return this.whereStatementController;
    }

    public getRelation(): Relation {
        return this.relation;
    }

}
