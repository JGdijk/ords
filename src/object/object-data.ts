export class ObjectData {

    private primary_key: string;

    private data: Map<number | string, string>;

    constructor(primary_key: string) {
        this.primary_key = primary_key;
        this.data = new Map();
    }

    public add(objects: any[]): number[] | string[] {
        // todo if object doesn't hold primary key error
        // todo check if object already exists
        let ids = [];
        for (const object of objects) {
            this.data.set(object[this.primary_key], object);
            ids.push(object[this.primary_key]);
        }
        return ids;
    }

    public update(ids: number[] | string[], data: any): any[] {
        let objects = [];

        for (const id of ids) {
            if (!this.data.has(id)) { continue; }

            const old_object = this.data.get(id);
            const new_object = Object.assign({}, old_object, data);
            this.data.set(id, new_object);

            objects.push(new_object);
        }

        return objects;
    }

    public remove(ids: number[]) : void {
        for (const id of ids) {
            this.data.delete(id);
        }
    }

    public has(key : number | string): boolean {
        return this.data.has(key)
    }

    public find(id: number | string): any {
        return this.data.get(id);
    }

    public get(): IterableIterator<string> {
        return this.data.values();
    }

}