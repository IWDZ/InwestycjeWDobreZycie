import { Building } from "./Building";

const MAX_FIELD_SIZE = 7;

export class PlotManager {
  public buildings: Array<Building>;
  public gridSize: number;
  public field: (null | undefined)[][];
  public plotPrices: Map<number, number>;

  constructor() {
    this.buildings = new Array();
    this.gridSize = MAX_FIELD_SIZE;
    this.plotPrices = new Map();

    const middle = Math.floor(MAX_FIELD_SIZE / 2);

    this.field = Array.from({ length: MAX_FIELD_SIZE }, () =>
      Array.from({ length: MAX_FIELD_SIZE }, () => undefined),
    );

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        this.field[middle + i][middle + j] = null;
      }
    }

    for (let row = 0; row < MAX_FIELD_SIZE; row++) {
      for (let col = 0; col < MAX_FIELD_SIZE; col++) {
        if (this.field[row][col] === undefined) {
          const dist = Math.max(Math.abs(row - middle), Math.abs(col - middle));
          this.plotPrices.set(row * MAX_FIELD_SIZE + col, dist * 500);
        }
      }
    }
  }

  public isUnlocked(index: number): boolean {
    const row = Math.floor(index / this.gridSize);
    const col = index % this.gridSize;
    return this.field[row]?.[col] !== undefined;
  }

  public getPrice(index: number): number {
    return this.plotPrices.get(index) ?? 0;
  }

  public unlockPlot(index: number): boolean {
    const row = Math.floor(index / this.gridSize);
    const col = index % this.gridSize;
    if (this.field[row]?.[col] !== undefined) return false;
    this.field[row][col] = null;
    return true;
  }
}
