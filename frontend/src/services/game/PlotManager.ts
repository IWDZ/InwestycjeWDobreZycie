import { Building } from "./Building";

export class PlotManager {
  public buildings: Array<Building>;
  public gridSize: number;
  public unlockedRadius: number;
  public unlockedPlots: Set<number>;
  public plotPrices: Map<number, number>;

  constructor(gridSize = 9, unlockedRadius = 0) {
    this.buildings = new Array();
    this.gridSize = gridSize;
    this.unlockedRadius = unlockedRadius;
    this.unlockedPlots = new Set();
    this.plotPrices = new Map();

    const center = Math.floor(gridSize / 2);
    for (let row = center - unlockedRadius; row <= center + unlockedRadius; row++) {
      for (let col = center - unlockedRadius; col <= center + unlockedRadius; col++) {
        this.unlockedPlots.add(row * gridSize + col);
      }
    }

    for (let i = 0; i < gridSize * gridSize; i++) {
      if (!this.unlockedPlots.has(i)) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const dist = Math.max(Math.abs(row - center), Math.abs(col - center));
        this.plotPrices.set(i, dist * 500);
      }
    }
  }

  public isUnlocked(index: number): boolean {
    return this.unlockedPlots.has(index);
  }

  public getPrice(index: number): number {
    return this.plotPrices.get(index) ?? 0;
  }

  public unlockPlot(index: number): boolean {
    if (this.unlockedPlots.has(index)) return false;
    this.unlockedPlots.add(index);
    return true;
  }
}