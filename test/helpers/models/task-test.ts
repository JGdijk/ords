import {Model} from "../../../src/model/model";
import {PrimaryKey} from "../../../src/model/decorators/primary-key";
import {HasMany} from "../../../src/model/decorators/relations/hasMany";
import {UserTest} from "./user-test";

export class TaskTest extends Model {

    @PrimaryKey() public task_id: number;

    public name: string;

    @HasMany({
        model: UserTest
    })
    public users: UserTest[];
}