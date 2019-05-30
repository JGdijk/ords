import {Model} from "../../../src/model/model";
import {PrimaryKey} from "../../../src/model/decorators/primary-key";

export class TaskTest extends Model {

    @PrimaryKey() public task_id: number;

    public name: string;
}