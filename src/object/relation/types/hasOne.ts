import {Relation} from "../relation";

export class HasOne extends Relation {

    protected is_silent: false;

    protected returns_many = false;
}
