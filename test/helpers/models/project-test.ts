import {Model} from "../../../src/model/model";
import {PrimaryKey} from "../../../src/model/decorators/primary-key";

export class ProjectTest extends Model {

    @PrimaryKey() public id: number;

    public name: string;
}