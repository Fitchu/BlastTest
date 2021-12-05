class TilesGroup extends Array {
  constructor(tiles) {
    super();
    this.tiles = tiles;
    this.minYByX = {};
  }

  push(value) {
    if (!this.minYByX[value.x] && this.minYByX[value.x] !== 0) {
      this.minYByX[value.x] = value.y;
    } else if (this.minYByX[value.x] > value.y) {
      this.minYByX[value.x] = value.y;
    }
    super.push(value);
  }
}
module.exports = TilesGroup;
