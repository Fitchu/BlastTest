import TilesGroupDeterminer from "./TilesGroupDeterminer";

class BombTilesGroupDeterminer extends TilesGroupDeterminer {
  constructor() {
    super(...arguments);
  }

  determineTilesGroup(position, explosionRadius) {
    const { column, row } = position;

    const columnStartIndex = this.getExplosionStartIndex(
      column,
      explosionRadius
    );
    const columnEndIndex = this.getExplosionEndIndex(
      column,
      this._tiles.columns - 1,
      explosionRadius
    );
    const rowStartIndex = this.getExplosionStartIndex(row, explosionRadius);
    const rowEndIndex = this.getExplosionEndIndex(
      row,
      this._tiles.rows - 1,
      explosionRadius
    );

    for (
      let columnIndex = columnStartIndex;
      columnIndex <= columnEndIndex;
      columnIndex++
    ) {
      for (let rowIndex = rowStartIndex; rowIndex <= rowEndIndex; rowIndex++) {
        this._tilesGroup.push({ column: columnIndex, row: rowIndex });
      }
    }
    return this._tilesGroup;
  }

  getExplosionStartIndex(index, radius) {
    const diff = index - radius;
    return diff > 0 ? diff : 0;
  }

  getExplosionEndIndex(index, max, radius) {
    const diff = index + radius;
    return diff < max ? diff : max;
  }
}

export default BombTilesGroupDeterminer;
