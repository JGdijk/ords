import {RdsObject} from "../../object/object";
import {WhereStatementController} from "../statements/where/where-statement-controller";
import {OrderByStatementController} from "../statements/orderby/order-by-statement-controller";
import {JoinStatementController} from "../statements/join/join-statement-controller";

export class InstanceData {

    private ids: number[] | string[];

    private initiated: boolean;

    private data: any[];

    private object: RdsObject;

    private whereStatementController: WhereStatementController;
    private orderByStatementController: OrderByStatementController;
    private joinStatementController: JoinStatementController;

    constructor(object: RdsObject) {
        this.object = object;

        this.whereStatementController = new WhereStatementController(this.object);
        this.orderByStatementController = new OrderByStatementController(this.object.getPrimaryKey());
        this.joinStatementController = new JoinStatementController();

        this.initiated = false;
        this.data = [];
        this.ids = [];
    }

    public getIds(): number[] | string[] {
        return this.ids;
    }

    public hasIds(): boolean {
        return !!(this.ids.length);
    }

    public setIds(ids: number | number[] | string | string[]): void {
        if (!ids) { return ;}

        if (!Array.isArray(ids)) {
            const array = [];
            array.push(ids);
            ids = array;
        }
        this.ids = ids;
    }

    public set(data: any[]): void {
        this.data = data;
    }

    public get(): any[] {
        return (this.initiated)
            ? this.data
            : this.init();
    }

    public getDataIds(): number[] {
        const data = this.get();
        let ids = [];

        for (const obj of data) {
            ids.push(obj[this.object.getPrimaryKey()]);
        }

        return ids;
    }

    public first(): any {
        return this.get()[0];
    }

    public getWhereStatementController(): WhereStatementController {
        return this.whereStatementController;
    }

    public getOrderByStatementController(): OrderByStatementController {
        return this.orderByStatementController;
    }

    public getJoinStatementController(): JoinStatementController {
        return this.joinStatementController;
    }

    public getObject(): RdsObject {
        return this.object;
    }

    public has(key: string): boolean {
        if (this.getObject().getModelName() === key) { return true; }
        if (this.whereStatementController.has(key)) { return true; }
        return (this.joinStatementController.has(key));
    }

    private init(): any[] {

        let data = (this.hasIds())
            ? this.object.find(this.ids)
            : this.object.get();

        if (this.whereStatementController.has()) {
            data = this.getWhereStatementController().filter(data);
        }

        let models = [];
        for (const obj of data) {
            models.push(this.getObject().createModel(obj));
        }

        if (this.orderByStatementController.has()) {
            models = this.getOrderByStatementController().order(models);
        } else {
            models = this.getOrderByStatementController().orderDefault(models);
        }

        if (this.getJoinStatementController().has()) {
            this.getJoinStatementController().attachMany(models);
        }

        this.data = models;

        this.initiated = true;

        return this.data;
    }
}
