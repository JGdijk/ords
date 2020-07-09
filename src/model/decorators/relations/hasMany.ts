import {modelDecoratorBag} from "../bag/model-decorator-bag";
import {RelationConfig} from "../../../object/relation/relation";


// todo we might want to allow the class itself here
type HasManyConfig = {
    model_name: string;
}

export function HasMany(config: HasManyConfig) {
    return function (target: any, key: string) {
        const relationConfig: RelationConfig = {
            name: key,
            model_name: config.model_name,
            type: 'hasMany',
        };
        modelDecoratorBag.addRelation(target.constructor, relationConfig);
    }
}
