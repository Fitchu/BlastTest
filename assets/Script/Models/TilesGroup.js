class TilesGroup extends Array {
  constructor(tiles) {
    super();
    this.tiles = tiles;
    this.minYByX = {};
  }

  push(value) {
    if (!this.length) this.head = value;
    if (!this.minYByX[value.x] && this.minYByX[value.x] !== 0) {
      this.minYByX[value.x] = value.y;
    } else if (this.minYByX[value.x] > value.y) {
      this.minYByX[value.x] = value.y;
    }
    super.push(value);
  }

  spliceHead() {
    if (!this.head) throw new Error("Tiles Group doesn't have a head.");
    const { x, y } = this.head;
    if (this.minYByX[x] === y) {
      const min = this.filter((tile) => tile.x === x && tile.y !== y).reduce(
        (acc, cur) => {
          if (!acc) acc = cur.y;
          else if (acc > cur.y) acc = cur.y;
          return acc;
        },
        0
      );
      if (min) {
        this.minYByX[x] = min;
      } else delete this.minYByX[x];
    }
    delete this.head;
    super.splice(0, 1);
  }
}
module.exports = TilesGroup;
