import { get } from "lodash";
import Position from "../Position";
import TilesGroup from "../TilesGroup";

class TilesGroupDeterminer {
  constructor(tiles) {
    this._tiles = tiles;
    this._tilesGroup = new TilesGroup(this._tiles);
  }

  determineTilesGroup(position, color) {
    const { column, row } = position;
    if (
      this._tilesGroup.find((tile) =>
        Position.isEqual(position, new Position(tile.column, tile.row))
      ) ||
      color !== get(this._tiles.tiles, `[${column}][${row}].name`)
    )
      return;

    this._tilesGroup.push(position);

    const positions = [
      new Position(column + 1, row),
      new Position(column - 1, row),
      new Position(column, row + 1),
      new Position(column, row - 1),
    ];
    positions.forEach((position) => {
      this.determineTilesGroup(position, color);
    });
    return this._tilesGroup;
  }

  clear() {
    this._tilesGroup = new TilesGroup(this._tiles);
  }
}

module.exports = TilesGroupDeterminer;
