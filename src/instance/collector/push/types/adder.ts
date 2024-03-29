import {PushController} from "../push-controller";
import {AddCollector} from "../../types/add-collector";

export class Adder {

    protected type: string;

    private keys: string[];

    private pushController: PushController;

    private collector: AddCollector;

    private checked: boolean;

    constructor(pushController: PushController) {
        this.type = 'add';
        this.keys = [];
        this.checked = false;

        this.pushController = pushController;
        this.collector = this.pushController.getCollectorController().getAddCollector();
    }

    public run(): void {

        if (!this.hasKeys()) { return; }

        this.processTarget();

        let data = null;

        if (this.checked) {
            if (this.pushController.getInstanceData().getOrderByStatementController().has()) {
                data = this.pushController.getInstanceData().getOrderByStatementController().order(this.pushController.getData());
            } else {
                data = this.pushController.getInstanceData().getOrderByStatementController().orderDefault(this.pushController.getData());
            }

            this.pushController.setData(data);
        }
    }

    private processTarget(): void {
        const key = this.pushController.getInstanceData().getObject().getPrettyName();

        // if the collector doesn't contain any target data we can skip
        if (!this.collector.has(key)) { return; }

        let data = this.collector.find(key);

        // filter out all the objects if ids are set
        if (this.pushController.getInstanceData().hasIds()) {
            data = this.filterIds(data);
        }

        // filter on where conditions
        if (this.pushController.getInstanceData().getWhereStatementController().has()) {
            data = this.pushController.getInstanceData().getWhereStatementController().filter(data);
        }

        if (!data.length) { return; }

        // by now we know we are going to add things.
        this.pushController.setChecked();
        this.checked = true;

        // todo we might want to build a system where the to add items are seperatly stored so when we check upon
        // todo the relations we don't double check the newly added items.

        // we create models out of the objects that have to be added
        let new_models = [];
        for (const obj of data) {
            new_models.push(this.pushController.getInstanceData().getObject().createModel(obj));
        }

        // check if relations needs to be attached.
        if (this.pushController.getInstanceData().getJoinStatementController().has()) {
            this.pushController.getInstanceData().getJoinStatementController().attachMany(new_models);
        }

        // add the objects
        let new_data = this.pushController.getData();

        const primary_key = this.pushController.getInstanceData().getObject().getPrimaryKey();

        newModelLoop: for (const object of new_models) {
            for (const new_data_object of new_data) {
                if (new_data_object[primary_key] === object[primary_key]) {
                    continue newModelLoop;
                }
            }
            new_data.push(object);
        }

        this.pushController.setData(new_data);
    }

    private filterIds(data: any[]): any[] {
        const primary_key = this.pushController.getInstanceData().getObject().getPrimaryKey();

        return data.filter((obj: any) => {
            for (const id of this.pushController.getInstanceData().getIds()) {
                if (id === obj[primary_key]) { return true; }
            }
            return false;
        })
    }

    private hasKeys(): boolean {
        for (const key of this.collector.keys()) {
            if (this.pushController.getInstanceData().has(key)) {
                this.keys.push(key);
            }
        }

        return !!(this.keys.length);
    }
}
