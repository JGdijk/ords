"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_decorator_bag_1 = require("./bag/model-decorator-bag");
function StringifyObject() {
    return function (target, key) {
        model_decorator_bag_1.modelDecoratorBag.addStringifyObject(target.constructor.name, key);
    };
}
exports.StringifyObject = StringifyObject;
