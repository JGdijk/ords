"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_decorator_bag_1 = require("../bag/model-decorator-bag");
function HasOne(config) {
    return function (target, key) {
        const relationConfig = {
            name: key,
            model_name: config.model.toLowerCase(),
            type: 'hasOne',
            returns_many: false
        };
        model_decorator_bag_1.modelDecoratorBag.addRelation(target.constructor.name, relationConfig);
    };
}
exports.HasOne = HasOne;
