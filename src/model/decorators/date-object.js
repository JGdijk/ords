"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_decorator_bag_1 = require("./bag/model-decorator-bag");
function DateObject() {
    return function (target, key) {
        model_decorator_bag_1.modelDecoratorBag.addDate(target.constructor.name, key);
    };
}
exports.DateObject = DateObject;
