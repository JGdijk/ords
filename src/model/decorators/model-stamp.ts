import {modelDecoratorBag} from "./bag/model-decorator-bag";

export function Stamp() {
    return function (target: any, key: string) {
        modelDecoratorBag.setModelStamp(target.constructor.name, key);
    }
}