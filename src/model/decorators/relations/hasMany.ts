import {modelDecoratorBag} from "../bag/model-decorator-bag";
import {RelationConfig} from "../../../object/relation/relation";


type HasManyConfig = {
    model: any;
}

export function HasMany(config: HasManyConfig) {
    return function (target: any, key: string) {
        const relationConfig: RelationConfig = {
            name: key,
            model_name: config.model.name, //todo name guessing
            type: 'hasMany',
            returns_many: true
        };
        modelDecoratorBag.addRelation(target.constructor.name, relationConfig);
    }
}