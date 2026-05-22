
export class Happiness {
    public level: number

    constructor() {
        this.level = 50;
    }

    public addLevel(num: number) {
        this.level += num;
    }

    public removeLevel(num: number) {
        this.level -= num;
    }
}