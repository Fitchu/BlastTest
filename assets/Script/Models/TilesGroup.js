class TilesGroup extends Array {
  constructor(tiles) {
    super();
    this._tiles = tiles;
    this.minYByX = {};
    this.destroyedCountByX = {};
  }

  push(value) {
    if (!this.length) this.head = value;
    if (!this.minYByX[value.column] && this.minYByX[value.column] !== 0) {
      this.minYByX[value.column] = value.row;
    } else if (this.minYByX[value.column] > value.row) {
      this.minYByX[value.column] = value.row;
    }
    if (!this.destroyedCountByX[value.column])
      this.destroyedCountByX[value.column] = 1;
    else this.destroyedCountByX[value.column]++;
    super.push(value);
  }

  decapitate() {
    if (!this.head) throw new Error("Tiles Group doesn't have a head.");
    const { column, row } = this.head;
    this.destroyedCountByX[column]--;
    if (this.minYByX[column] === row) {
      const min = this.filter(
        (tile) => tile.column === column && tile.row !== row
      ).reduce((acc, cur) => {
        if (!acc) acc = cur.row;
        else if (acc > cur.row) acc = cur.row;
        return acc;
      }, 0);
      if (min) {
        this.minYByX[column] = min;
      } else {
        delete this.minYByX[column];
        delete this.destroyedCountByX[column];
      }
    }
    delete this.head;
    super.splice(0, 1);
  }

  destroy() {
    console.log(this._tiles);
    return this._tiles.destroy(...arguments);
  }
}
module.exports = TilesGroup;
