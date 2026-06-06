export class PlotManager {
  public field: (null | undefined | any)[][];

  constructor() {
    this.field = [];
  }

  public get gridSize(): number {
    return this.field.length;
  }

  public syncFromServer(serverField: any[][]) {
    this.field = serverField.map((row) =>
      row.map((cell) => {
        if (cell === null) return undefined;
        if (cell === "empty") return null;
        return cell;
      })
    );
  }

  public isUnlocked(index: number): boolean {
    const row = Math.floor(index / this.gridSize);
    const col = index % this.gridSize;
    return this.field[row]?.[col] !== undefined;
  }

  public get unlockedPlots(): Set<number> {
    const set = new Set<number>();
    for (let y = 0; y < this.field.length; y++) {
      for (let x = 0; x < this.field[y].length; x++) {
        if (this.field[y][x] !== undefined) {
          set.add(y * this.gridSize + x);
        }
      }
    }
    return set;
  }
}