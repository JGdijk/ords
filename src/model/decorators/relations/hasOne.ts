import {modelDecoratorBag} from "../bag/model-decorator-bag";
import {RelationConfig} from "../../../object/relation/relation";

type HasOneConfig = {
    model: string; //todo name guessing
}

export function HasOne(config: HasOneConfig) {
    return function (target: any, key: string) {
        const relationConfig: RelationConfig = {
            name: key,
            model_name: config.model.toLowerCase(), //todo name guessing
            type: 'hasOne',
            returns_many: false
        };
        modelDecoratorBag.addRelation(target.constructor.name, relationConfig);
    }
}