"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const where_statement_controller_bag_1 = require("./where-statement-controller-bag");
class WhereStatementController {
    constructor(object) {
        this.object = object;
        this.bags = [];
        this.addBag();
        this.has_check = null;
        this.has_where_has_check = null;
        this.has_where_doesnt_have_check = null;
        this.has_check_key_object = {};
        this.has_where_has_check_key_object = {};
        this.has_where_has_complicated_check_key_object = {};
        this.has_where_doesnt_have_check_key_object = {};
        this.has_where_doesnt_have_complicated_check_key_object = {};
    }
    add(statement) {
        this.bags[0].add(statement);
    }
    addNewBag(statement) {
        const bag = this.addBag();
        bag.add(statement);
    }
    has(key) {
        if (!key && this.has_check !== null) {
            return this.has_check;
        }
        if (key && this.has_check_key_object.hasOwnProperty(key)) {
            return this.has_check_key_object[key];
        }
        for (const bag of this.bags) {
            if (bag.has(key)) {
                if (!key) {
                    this.has_check = true;
                }
                else {
                    this.has_check_key_object[key] = true;
                }
                return true;
            }
        }
        if (!key) {
            this.has_check = false;
        }
        else {
            this.has_check_key_object[key] = false;
        }
        return false;
    }
    hasWhereHas(key) {
        for (const bag of this.bags) {
            if (bag.hasWhereHas(key)) {
                return true;
            }
        }
        return false;
    }
    hasWhereHasComplicated(key) {
        for (const bag of this.bags) {
            if (bag.hasWhereHasComplicated(key)) {
                return true;
            }
        }
        return false;
    }
    hasWhereDoesntHave(key) {
        for (const bag of this.bags) {
            if (bag.hasWhereDoesntHave(key)) {
                return true;
            }
        }
        return false;
    }
    hasWhereDoesntHaveComplicated(key) {
        for (const bag of this.bags) {
            if (bag.hasWhereDoesntHaveComplicated(key)) {
                return true;
            }
        }
        return false;
    }
    filter(objects) {
        let allowed_objects = [];
        for (const bag of this.bags) {
            const bag_objects = bag.filter(objects.slice());
            objectLoop: for (const object of bag_objects) {
                for (const allowed_object of allowed_objects) {
                    if (allowed_object[this.object.getPrimaryKey()] === object[this.object.getPrimaryKey()]) {
                        continue objectLoop;
                    }
                }
                allowed_objects.push(object);
            }
        }
        return allowed_objects;
    }
    check(object) {
        for (const bag of this.bags) {
            if (bag.check(object)) {
                return true;
            }
        }
        return false;
    }
    addBag() {
        const bag = new where_statement_controller_bag_1.WhereStatementControllerBag();
        this.bags.push(bag);
        return bag;
    }
}
exports.WhereStatementController = WhereStatementController;
