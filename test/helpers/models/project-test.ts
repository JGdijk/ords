import {Model} from "../../../src/model/model";
import {TaskTest} from "./task-test";
import {Stamp} from "../../../src/model/decorators/model-stamp";
import {ModelStamp} from "../../../src/model/stamp/model-stamp";
import {PrimaryKey} from "../../../src/model/decorators/primary-key";
import {HasMany} from "../../../src/object/relation/types/hasMany";

export class ProjectTest extends Model {
    
    public id: number;

    public name: string;

    public tasks: TaskTest[];

    public testFunction (): string {
        return 'test';
    }

    // @Stamp() public modelStamp: ModelStamp;
}
