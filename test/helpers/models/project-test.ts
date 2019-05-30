import {Model} from "../../../src/model/model";
import {PrimaryKey} from "../../../src/model/decorators/primary-key";
import {TaskTest} from "./task-test";
import {HasMany} from "../../../src/model/decorators/relations/hasMany";

export class ProjectTest extends Model {

    @PrimaryKey() public id: number;

    public name: string;

    @HasMany({
        model: TaskTest
    })
    public tasks: TaskTest[];
}