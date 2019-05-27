import {Relation, RelationConfig} from "./relation";
import {HasOne} from "./types/hasOne";
import {HasMany} from "./types/hasMany";
import {Rds} from "../../rds";
import {SilentRelation} from "./types/silent";

export class RelationContainer {

    private relations: Relation[];

    constructor() {
        this.relations = [];
    }

    public initReverse(): void {
        for (const relation of this.relations) {
            relation.initReverse()
        }
    }

    public add(config: RelationConfig, local_name: string, rds: Rds): void {

        switch (config.type) {
            case 'silent':
                this.relations.push(new SilentRelation(config, local_name, rds));
                break;
            case 'hasOne':
                this.relations.push(new HasOne(config, local_name, rds));
                break;
            case 'hasMany':
                this.relations.push(new HasMany(config, local_name, rds));
                break;
        }
    }

    public findByObjectName(key: string): Relation {
        for (const relation of this.relations) {
            if (key === relation.getObjectName()) {
                return relation;
            }
        }
        return null;
    }

    public findByModelName(key: string): Relation {
        for (const relation of this.relations) {
            if (key === relation.getModelName()) {
                return relation;
            }
        }
        return null;
    }

    public hasByObjectName(key: string): boolean {
        for (const relation of this.relations) {
            if (key === relation.getObjectName()) {
               return true;
            }
        }
        return false;
    }

    public hasByModelName(key: string): boolean {
        for (const relation of this.relations) {
            if (key === relation.getModelName()) {
                return true;
            }
        }
        return false;
    }

    public isEmpty(): boolean {
        return !(this.relations.length);
    }

}