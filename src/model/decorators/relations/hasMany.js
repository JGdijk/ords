"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_decorator_bag_1 = require("../bag/model-decorator-bag");
function HasMany(config) {
    return function (target, key) {
        const relationConfig = {
            name: key,
            model_name: config.model.toLowerCase(),
            type: 'hasMany',
            returns_many: true
        };
        model_decorator_bag_1.modelDecoratorBag.addRelation(target.constructor.name, relationConfig);
    };
}
exports.HasMany = HasMany;
