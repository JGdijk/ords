import {Model} from "../../../src/model/model";
import {PrimaryKey} from "../../../src/model/decorators/primary-key";
import {TaskTest} from "./task-test";
import {HasMany} from "../../../src/model/decorators/relations/hasMany";
import {Stamp} from "../../../src/model/decorators/model-stamp";
import {ModelStamp} from "../../../src/model/stamp/model-stamp";

export class ProjectTest extends Model {

    public id: number;

    public name: string;

    public tasks: TaskTest[];

    public testFunction (): string {
        return 'test';
    }

    @Stamp() public modelStamp: ModelStamp;
}
