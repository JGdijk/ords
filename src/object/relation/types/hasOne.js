"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const relation_1 = require("../relation");
class HasOne extends relation_1.Relation {
    constructor(config, local_name, rds) {
        super(config, local_name, rds);
        this.is_silent = false;
    }
}
exports.HasOne = HasOne;
