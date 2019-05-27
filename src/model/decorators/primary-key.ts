import {modelDecoratorBag} from "./bag/model-decorator-bag";

export function PrimaryKey() {
    return function (target: any, key: string) {
        modelDecoratorBag.setPrimaryKey(target.constructor.name, key);
    }
}