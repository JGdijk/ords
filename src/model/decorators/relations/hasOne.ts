import {modelDecoratorBag} from "../bag/model-decorator-bag";
import {RelationConfig} from "../../../object/relation/relation";

type HasOneConfig = {
    model_name: string;
}

export function HasOne(config: HasOneConfig) {
    return function (target: any, key: string) {
        const relationConfig: RelationConfig = {
            name: key,
            model_name: config.model_name,
            type: 'hasOne',
        };
        modelDecoratorBag.addRelation(target.constructor, relationConfig);
    }
}
