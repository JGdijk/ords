"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instance_data_controller_1 = require("./data/instance-data-controller");
const where_statement_1 = require("./statements/where/statements/where-statement");
const order_by_statement_1 = require("./statements/orderby/order-by-statement");
const join_statement_1 = require("./statements/join/statements/join-statement");
const join_callback_statement_1 = require("./statements/join/statements/callback/join-callback-statement");
const where_statement_callback_statement_1 = require("./statements/where/statements/callback/where/where-statement-callback-statement");
const where_has_statement_1 = require("./statements/where/statements/where-has-statement");
const where_has_statement_callback_statement_1 = require("./statements/where/statements/callback/where-has/where-has-statement-callback-statement");
const where_doesnt_have_statement_1 = require("./statements/where/statements/where-doesnt-have-statement");
const where_doesnt_have_statement_callback_statement_1 = require("./statements/where/statements/callback/where-doesnt-have/where-doesnt-have-statement-callback-statement");
const where_between_statement_1 = require("./statements/where/statements/where-between-statement");
const where_not_between_statement_1 = require("./statements/where/statements/where-not-between-statement");
const where_in_statement_1 = require("./statements/where/statements/where-in-statement");
const where_not_in_statement_1 = require("./statements/where/statements/where-not-in-statement");
const where_exists_statement_1 = require("./statements/where/statements/where-exists-statement");
const where_not_exists_statement_1 = require("./statements/where/statements/where-not-exists-statement");
const where_empty_statement_1 = require("./statements/where/statements/where-empty-statement");
const where_not_empty_statement_1 = require("./statements/where/statements/where-not-empty-statement");
class Instance {
    constructor(rds, object) {
        this.rds = rds;
        this.object = object;
        this.dataController = new instance_data_controller_1.InstanceDataController(rds, object);
    }
    /*************************** retrieving ***************************
     ******************************************************************/
    find(ids) {
        return this.dataController.find(ids);
    }
    first() {
        return this.dataController.first();
    }
    get() {
        return this.dataController.get();
    }
    getIds() {
        return this.dataController.getIds();
    }
    count() {
        return this.dataController.count();
    }
    // static
    findStatic(ids) {
        return this.dataController.findStatic(ids);
    }
    firstStatic() {
        return this.dataController.firstStatic();
    }
    getStatic() {
        return this.dataController.getStatic();
    }
    getIdsStatic() {
        return this.dataController.getIdsStatic();
    }
    countStatic() {
        return this.dataController.countStatic();
    }
    /*************************** where statements ***************************
     ******************************************************************/
    where(key, action, value) {
        if (action) {
            this.dataController.getInstanceData().getWhereStatementController().add(new where_statement_1.WhereStatement(key, action, value));
        }
        else {
            this.dataController.getInstanceData().getWhereStatementController().add(new where_statement_callback_statement_1.WhereStatementCallbackStatement(key, this.object));
        }
        return this;
    }
    orWhere(key, action, value) {
        if (action) {
            this.dataController.getInstanceData().getWhereStatementController().addNewBag(new where_statement_1.WhereStatement(key, action, value));
        }
        else {
            this.dataController.getInstanceData().getWhereStatementController().addNewBag(new where_statement_callback_statement_1.WhereStatementCallbackStatement(key, this.object));
        }
        return this;
    }
    whereBetween(key, low, high) {
        this.dataController.getInstanceData().getWhereStatementController().add(new where_between_statement_1.WhereBetweenStatement(key, low, high));
        return this;
    }
    whereNotBetween(key, low, high) {
        this.dataController.getInstanceData().getWhereStatementController().add(new where_not_between_statement_1.WhereNotBetweenStatement(key, low, high));
        return this;
    }
    whereIn(key, values) {
        this.dataController.getInstanceData().getWhereStatementController().add(new where_in_statement_1.WhereInStatement(key, values));
        return this;
    }
    whereNotIn(key, values) {
        this.dataController.getInstanceData().getWhereStatementController().add(new where_not_in_statement_1.WhereNotInStatement(key, values));
        return this;
    }
    whereExists(key) {
        this.dataController.getInstanceData().getWhereStatementController().add(new where_exists_statement_1.WhereExistsStatement(key));
        return this;
    }
    whereNotExists(key) {
        this.dataController.getInstanceData().getWhereStatementController().add(new where_not_exists_statement_1.WhereNotExistsStatement(key));
        return this;
    }
    whereEmpty(key) {
        this.dataController.getInstanceData().getWhereStatementController().add(new where_empty_statement_1.WhereEmptyStatement(key));
        return this;
    }
    whereNotEmpty(key) {
        this.dataController.getInstanceData().getWhereStatementController().add(new where_not_empty_statement_1.WhereNotEmptyStatement(key));
        return this;
    }
    // todo where on dates
    whereHas(key, callback) {
        //todo checks if relation is not found
        const relation = this.object.getRelationContainer().findByObjectName(key);
        if (callback) {
            this.dataController.getInstanceData().getWhereStatementController().add(new where_has_statement_callback_statement_1.WhereHasStatementCallbackStatement(relation, callback));
        }
        else {
            this.dataController.getInstanceData().getWhereStatementController().add(new where_has_statement_1.WhereHasStatement(relation));
        }
        return this;
    }
    whereDoesntHave(key, callback) {
        const relation = this.object.getRelationContainer().findByObjectName(key);
        if (callback) {
            this.dataController.getInstanceData().getWhereStatementController().add(new where_doesnt_have_statement_callback_statement_1.WhereDoesntHaveStatementCallbackStatement(relation, callback));
        }
        else {
            this.dataController.getInstanceData().getWhereStatementController().add(new where_doesnt_have_statement_1.WhereDoesntHaveStatement(relation));
        }
        return this;
    }
    /*************************** order by ***************************
     ******************************************************************/
    orderBy(key, order) {
        this.dataController.getInstanceData().getOrderByStatementController().add(new order_by_statement_1.OrderByStatement(key, order));
        return this;
    }
    /*************************** join ***************************
     ******************************************************************/
    with(name, callback) {
        if (callback && !Array.isArray(name)) {
            if (!this.object.getRelationContainer().hasByObjectName(name)) {
                return this;
            }
            const relation = this.object.getRelationContainer().findByObjectName(name);
            this.dataController.getInstanceData().getJoinStatementController().add(new join_callback_statement_1.JoinCallbackStatement(relation, callback));
        }
        else {
            if (!Array.isArray(name)) {
                if (!this.object.getRelationContainer().hasByObjectName(name)) {
                    return this;
                }
                const relation = this.object.getRelationContainer().findByObjectName(name);
                this.dataController.getInstanceData().getJoinStatementController().add(new join_statement_1.JoinStatement(relation));
            }
            else {
                for (const v of name) {
                    if (!this.object.getRelationContainer().hasByObjectName(v)) {
                        return this;
                    }
                    const relation = this.object.getRelationContainer().findByObjectName(v);
                    this.dataController.getInstanceData().getJoinStatementController().add(new join_statement_1.JoinStatement(relation));
                }
            }
        }
        return this;
    }
    /*************************** direct actions ***************************
     ******************************************************************/
    update(data) {
        let objects = this.object.get();
        objects = this.dataController.getInstanceData().getWhereStatementController().filter(objects);
        let ids = [];
        for (const object of objects) {
            ids.push(object[this.object.getPrimaryKey()]);
        }
        this.rds.update(this.object.getModelName(), ids, data);
    }
    remove(ids) {
        this.rds.remove(this.object.getModelName(), ids);
    }
    attach(relation_name, relation_ids) {
        const relation_ids_array = (Array.isArray(relation_ids))
            ? relation_ids
            : [relation_ids];
        const object_ids_array = this.getIdsStatic();
        this.rds.attach(this.object.getModelName(), relation_name, object_ids_array, relation_ids_array);
    }
    detach(relation_name, relation_ids) {
        let relation_ids_array = null;
        if (!relation_ids || relation_ids === '*') {
            relation_ids_array = ['*'];
        }
        else {
            relation_ids_array = (Array.isArray(relation_ids))
                ? relation_ids
                : [relation_ids];
        }
        const object_ids_array = this.getIdsStatic();
        this.rds.detach(this.object.getModelName(), relation_name, object_ids_array, relation_ids_array);
    }
}
exports.Instance = Instance;
