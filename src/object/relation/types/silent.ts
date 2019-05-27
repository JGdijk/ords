import {Relation, RelationConfig} from "../relation";
import {Rds} from "../../../rds";

export class SilentRelation extends Relation {

    protected is_silent: boolean;

    constructor(config: RelationConfig, local_name: string, rds: Rds) {
        super(config, local_name, rds);
        this.is_silent = true;
    }
}