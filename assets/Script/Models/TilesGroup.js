class TilesGroup extends Array {
  constructor(tiles) {
    super();
    this._tiles = tiles;
    this.minRowByColumn = {};
    this.tilesInColumn = {};
  }

  push(value) {
    if (!this.length) this.head = value;
    if (
      !this.minRowByColumn[value.column] &&
      this.minRowByColumn[value.column] !== 0
    ) {
      this.minRowByColumn[value.column] = value.row;
    } else if (this.minRowByColumn[value.column] > value.row) {
      this.minRowByColumn[value.column] = value.row;
    }
    if (!this.tilesInColumn[value.column]) this.tilesInColumn[value.column] = 1;
    else this.tilesInColumn[value.column]++;
    super.push(value);
  }

  decapitate() {
    if (!this.head) throw new Error("Tiles Group doesn't have a head.");
    const { column, row } = this.head;
    this.tilesInColumn[column]--;
    if (this.minRowByColumn[column] === row) {
      const min = this.filter(
        (tile) => tile.column === column && tile.row !== row
      ).reduce((acc, cur) => {
        if (!acc) acc = cur.row;
        else if (acc > cur.row) acc = cur.row;
        return acc;
      }, 0);
      if (min) {
        this.minRowByColumn[column] = min;
      } else {
        delete this.minRowByColumn[column];
        delete this.tilesInColumn[column];
      }
    }
    delete this.head;
    super.splice(0, 1);
  }

  destroy() {
    return this._tiles.destroy(...arguments);
  }
}
export default TilesGroup;
