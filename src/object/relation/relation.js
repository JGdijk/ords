"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Relation {
    constructor(config, local_name, rds) {
        this.model_name = config.model_name;
        this.object_name = config.name;
        this.returns_many = config.returns_many;
        this.data = new Map();
        this.local_name = local_name;
        this.relationRdsObject = rds.getObjectContainer().find(this.model_name);
        this.localRdsObject = rds.getObjectContainer().find(this.local_name);
        this.rds = rds;
    }
    initReverse() {
        if (this.relationRdsObject.getRelationContainer().hasByModelName(this.local_name)) {
            return;
        }
        this.relationRdsObject.getRelationContainer().add({
            name: this.local_name,
            model_name: this.local_name,
            type: 'silent',
            returns_many: false,
        }, this.relationRdsObject.getPrettyName(), this.rds);
    }
    // todo this should be attach and remove should be detach, we should not accept objects in relation
    add(local_id, objects, collector) {
        let relation_ids = null;
        if (!this.returns_many) {
            relation_ids = this.relationRdsObject.add(objects, collector);
            this.data.set(local_id, relation_ids[0]);
        }
        else {
            relation_ids = this.relationRdsObject.add(objects, collector);
            if (!this.data.has(local_id)) {
                this.data.set(local_id, relation_ids);
            }
            else {
                const new_array = [...this.data.get(local_id), ...relation_ids];
                this.data.set(local_id, new_array);
            }
        }
        if (!this.relationRdsObject.getRelationContainer().hasByModelName(this.local_name)) {
            return;
        }
        this.relationRdsObject.getRelationContainer().findByModelName(this.local_name).inherit(relation_ids, local_id, collector);
    }
    inherit(local_ids, object_id, collector) {
        for (const id of local_ids) {
            if (!this.returns_many) {
                this.data.set(id, object_id);
            }
            else {
                if (!this.data.has(id)) {
                    this.data.set(id, [object_id]);
                }
                else {
                    const new_array = [object_id, ...this.data.get(id)];
                    this.data.set(object_id, new_array);
                }
            }
            const array = [object_id];
            collector.attach(this.local_name, this.getModelName(), id, array);
        }
    }
    findByObject(object, create_models = false) {
        return this.find(object[this.rds.getObjectContainer().find(this.local_name).getPrimaryKey()], create_models);
    }
    find(id, create_models = false) {
        const ids = (this.returns_many)
            ? this.data.get(id)
            : [this.data.get(id)];
        if ((!this.returnsMany() && !ids) || (this.returnsMany() && (!ids || !ids.length))) {
            return (this.returns_many)
                ? []
                : null;
        }
        const objects = this.relationRdsObject.find(ids);
        if (!create_models) {
            return (this.returns_many)
                ? (objects.length) ? objects : []
                : (objects.length) ? objects[0] : null;
        }
        let models = [];
        for (const obj of objects) {
            models.push(this.getRelationObject().createModel(obj));
        }
        return (this.returns_many)
            ? (models.length) ? models : []
            : (models.length) ? models[0] : null;
    }
    has(id) {
        if (!this.data.has(id)) {
            return false;
        }
        const ids = this.data.get(id);
        if (!this.returnsMany()) {
            return this.relationRdsObject.has(ids);
        }
        else {
            for (const i of ids) {
                if (this.relationRdsObject.has(i)) {
                    return true;
                }
            }
        }
        return false;
    }
    hasByObject(object) {
        return this.has(object[this.getLocalObject().getPrimaryKey()]);
    }
    // todo we might want to check in the future what relations are actually attached
    attach(object_ids, relation_ids, collector) {
        for (const object_id of object_ids) {
            let corrected_relation_ids = null;
            if (!this.localRdsObject.has(object_id)) {
                continue;
            }
            if (!this.returns_many) {
                this.data.set(object_id, relation_ids[0]);
                corrected_relation_ids = relation_ids;
            }
            else {
                if (!this.data.has(object_id)) {
                    this.data.set(object_id, relation_ids);
                    corrected_relation_ids = relation_ids;
                }
                else {
                    // we have to check for duplicates
                    const array = this.data.get(object_id);
                    corrected_relation_ids = [];
                    for (const id of relation_ids) {
                        if (!array.includes(id)) {
                            corrected_relation_ids.push(id);
                            array.push(id);
                        }
                    }
                    this.data.set(object_id, array);
                }
            }
            collector.attach(this.local_name, this.getModelName(), object_id, corrected_relation_ids);
            // todo check if actually something was updated
            if (!this.relationRdsObject.getRelationContainer().hasByModelName(this.local_name)) {
                continue;
            }
            this.relationRdsObject.getRelationContainer().findByModelName(this.local_name).inherit(corrected_relation_ids, object_id, collector);
        }
    }
    // todo filter what really was detached
    detach(object_ids, relation_ids, collector) {
        // because we get a * as relation id's we have to create an array with relation ids in case the
        // relation is mirrored
        let wildcard_relation_ids = [];
        for (const object_id of object_ids) {
            if (!this.data.has(object_id)) {
                continue;
            }
            if (!this.returns_many) {
                if (relation_ids[0] === '*') {
                    // because we get a * as relation id's we have to create an array with relation ids in case the
                    // relation is mirrored
                    if (!wildcard_relation_ids.includes(this.data.get(object_id))) {
                        wildcard_relation_ids.push(this.data.get(object_id));
                    }
                    this.data.delete(object_id);
                }
                else if (relation_ids.includes(this.data.get(object_id))) {
                    this.data.delete(object_id);
                }
            }
            else {
                let new_array = [];
                if (relation_ids[0] !== '*') {
                    new_array = this.data.get(object_id).filter((id) => {
                        return !relation_ids.includes(id);
                    });
                }
                else {
                    for (const relation_id of this.data.get(object_id)) {
                        if (!wildcard_relation_ids.includes(relation_id)) {
                            wildcard_relation_ids.push(relation_id);
                        }
                    }
                }
                if (!new_array.length) {
                    this.data.delete(object_id);
                }
                else {
                    this.data.set(object_id, new_array);
                }
            }
            if (wildcard_relation_ids.length) {
                relation_ids = wildcard_relation_ids;
            }
            collector.detach(this.local_name, this.getModelName(), object_id, relation_ids);
            // todo check if actually something was updated
            if (!this.relationRdsObject.getRelationContainer().hasByModelName(this.local_name)) {
                continue;
            }
            // todo if wildcard we have to throw it around
            this.relationRdsObject.getRelationContainer().findByModelName(this.local_name).inheritDetach(relation_ids, object_id, collector);
        }
    }
    inheritDetach(local_ids, object_id, collector) {
        for (const local_id of local_ids) {
            if (!this.returns_many) {
                this.data.delete(local_id);
            }
            else {
                if (!this.data.has(local_id)) {
                    continue;
                }
                else {
                    const new_array = this.data.get(local_id).filter((id) => {
                        return id !== object_id;
                    });
                    this.data.set(local_id, new_array);
                }
            }
            const array = [object_id];
            collector.detach(this.local_name, this.getModelName(), local_id, array);
        }
    }
    getObjectName() {
        return this.object_name;
    }
    getModelName() {
        return this.model_name;
    }
    returnsMany() {
        return this.returns_many;
    }
    getRelationObject() {
        return this.relationRdsObject;
    }
    getLocalObject() {
        return this.localRdsObject;
    }
}
exports.Relation = Relation;
