import {WhereStatementInterface} from "../where-statement-interface";

export class WhereStatement implements WhereStatementInterface {

    private key: string;

    private action: string;

    private value: string | number;

    constructor(key: string, action: string ,value: string | number) {
        this.key = key;
        this.action = action;
        this.value = value;
    }

    public check(object: any): boolean {

        if (!object.hasOwnProperty(this.key)) { return false; }

        switch (this.action) {
            case '===':
                return (object[this.key] === this.value);
            case '!==':
                return (object[this.key] !== this.value);
            case '==':
                return (object[this.key] == this.value);
            case '!=':
                return (object[this.key] != this.value);
            case '=':
                return (object[this.key] == this.value);
            case '>':
                return (object[this.key] > this.value);
            case '<':
                return (object[this.key] < this.value);
            case '>=':
                return (object[this.key] >= this.value);
            case '<=':
                return (object[this.key] <= this.value);
            default:
                return false;
        }
    }

    public filter(objects: any[]): any[] {
        return objects.filter((objects: any) => {
            return this.check(objects);
        })
    }

    public has(key : string): boolean { return false; }

    public hasWhereHas(key?: string): boolean { return false; }

    public hasWhereHasComplicated(key: string) { return false; }

    public hasWhereDoesntHave(key?: string): boolean { return false; }

    public hasWhereDoesntHaveComplicated(key: string): boolean { return false;}
}