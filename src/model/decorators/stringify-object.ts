import {modelDecoratorBag} from "./bag/model-decorator-bag";

export function StringifyObject() {
    return function (target: any, key: string) {
        modelDecoratorBag.addStringifyObject(target.constructor, key);
    }
}
