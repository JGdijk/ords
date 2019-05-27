// import {PushController} from "./push-controller";
// import {AddCollector} from "../types/add-collector";
// import {AttachCollector} from "../types/attach-collector";
// import {DetachCollector} from "../types/detach-collector";
// import {RemoveCollector} from "../types/remove-collector";
// import {UpdateCollector} from "../types/update-collector";
//
//
// export abstract class Push {
//
//     protected abstract type: string;
//
//     protected keys: string[];
//
//     protected pushController: PushController;
//
//     protected constructor(pushController: PushController) {
//
//
//         this.pushController = pushController;
//         this.keys = [];
//     }
//
//     protected checkKeys(): boolean {
//         for (const key of this.getCollector().keys()) {
//             if (this.pushController.getInstanceData().has(key)) {
//                 this.keys.push(key);
//             }
//         }
//         return !!(this.keys.length);
//     }
//
//     // protected getCollector(): AddCollector | AttachCollector | DetachCollector | RemoveCollector | UpdateCollector {
//     //     return this.pushController.getCollectorController().get(this.type);
//     // }
//
// }