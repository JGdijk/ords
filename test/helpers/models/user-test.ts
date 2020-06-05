import {Model} from "../../../src/model/model";
import {AddressTest} from "./address-test";

export class UserTest extends Model {

    public id: number;

    public name: string;

    public address: AddressTest
}
