
export class Location {
    public locations: Array<Pos>

    constructor() {
        this.locations = new Array();
    }
}

export class Pos {
    private x: number
    private y: number

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    public setCoordinates(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getCoordinates(): [number, number] {
        return [this.x, this.y]
    }
}