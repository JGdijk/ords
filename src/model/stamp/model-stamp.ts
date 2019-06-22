export class ModelStamp {

    private timeStamp: number;

    private initiated: boolean;
    private added: boolean;
    private updated: boolean;

    private parentChanged: boolean;
    private childChanged: boolean;

    constructor(timestamp) {
        this.timeStamp = timestamp;

        this.initiated = false;
        this.added = false;
        this.updated = false;

        this.parentChanged = false;
        this.childChanged = false;
    }

    public getTimestamp(): number {
        return this.timeStamp;
    }

    public isInitiated (): boolean {
        return this.initiated;
    }

    public setInitiated (): void {
        this.initiated = true;
    }

    public isAdded(): boolean {
        return this.added;
    }

    public setAdded(): void {
        this.added = true;
    }

    public isUpdated(): boolean {
        return this.updated;
    }

    public setUpdated(): void {
        this.updated = true;
    }

    public parentIsChanged(): boolean {
        return this.parentChanged;
    }

    public setParentChanged(): void {
        this.parentChanged = true;
    }

    public childIsChanged(): boolean {
        return this.childChanged;
    }

    public setChildChanged(): void {
        this.childChanged = true;
    }

}