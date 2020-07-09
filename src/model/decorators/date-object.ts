import {modelDecoratorBag} from "./bag/model-decorator-bag";

export function DateObject() {
    return function (target: any, key: string) {
        modelDecoratorBag.addDate(target.constructor, key);
    }
}
