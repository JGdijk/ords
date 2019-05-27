"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_decorator_bag_1 = require("./bag/model-decorator-bag");
function PrimaryKey() {
    return function (target, key) {
        model_decorator_bag_1.modelDecoratorBag.setPrimaryKey(target.constructor.name, key);
    };
}
exports.PrimaryKey = PrimaryKey;
