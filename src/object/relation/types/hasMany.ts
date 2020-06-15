import {Relation} from "../relation";

export class HasMany extends Relation {

    protected is_silent: false;

    protected returns_many = true;
}
