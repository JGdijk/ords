export class OrderByStatement {

    private key: string;

    private ord: string;

    constructor(key: string, order?: string) {
        this.key = key;
        this.ord = (order) ? order.toLowerCase() : 'asc';
    }

    public order(data: any[]): any[] {

        // todo we have to throw a big error when the key of the order doesn't exist on the object
        if (this.ord !== 'desc' && this.ord !== 'asc') return; // todo trow big error
        let desc = (this.ord === 'desc');

        return data.sort((obj1, obj2) => {
            if (Number.isInteger(obj1[this.key]) && Number.isInteger(obj2[this.key])) {
                return (desc)
                    ? obj2[this.key] - obj1[this.key]
                    : obj1[this.key] - obj2[this.key];
            }

            if (Number.isInteger(obj1[this.key])) return (desc) ? -1 : 1;
            if (Number.isInteger(obj2[this.key])) return (desc) ? 1 : -1;

            const a = (obj1[this.key]) ? obj1[this.key] : '';
            const b = (obj2[this.key]) ? obj2[this.key] : '';

            return (desc)
                ? b.localeCompare(a)
                : a.localeCompare(b);
        });
    }

}