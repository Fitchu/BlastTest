import TilesGroupDeterminer from "./TilesGroupDeterminer";
import BombTilesGroupDeterminer from "./BombTilesGroupDeterminer";

class SuperTilesGroupDeterminer extends TilesGroupDeterminer {
  constructor(explosionAmplificationBySuperTile, tiles) {
    super(tiles);
    this._explosionAmplificationBySuperTile = explosionAmplificationBySuperTile;
    this._bombTilesGroupDeterminer = new BombTilesGroupDeterminer(tiles);
  }

  determineTilesGroup(position, explosionRadius, isExplosion) {
    const { column, row } = position;
    if (isExplosion) {
      this._bombTilesGroupDeterminer.clear();
      return this._bombTilesGroupDeterminer.determineTilesGroup(
        position,
        explosionRadius * this._explosionAmplificationBySuperTile
      );
    }
    const variant = Math.floor(Math.random() * 100);
    if (0 < variant && variant < 31) {
      return this.determineTilesGroupByColumn(column);
    } else if (30 < variant && variant < 61) {
      return this.determineTilesGroupByRow(row);
    } else if (60 < variant && variant < 91) {
      this._bombTilesGroupDeterminer.clear();
      return this._bombTilesGroupDeterminer.determineTilesGroup(
        position,
        explosionRadius
      );
    } else if (variant < 101) {
      return this.determineTilesGroupByArea();
    }
    return this._tilesGroup;
  }
  determineTilesGroupByColumn(column) {
    for (let row = 0; row < this._tiles.rows; row++) {
      this._tilesGroup.push({ column, row });
    }
    return this._tilesGroup;
  }
  determineTilesGroupByRow(row) {
    for (let column = 0; column < this._tiles.columns; column++) {
      this._tilesGroup.push({ column, row });
    }
    return this._tilesGroup;
  }
  determineTilesGroupByArea() {
    for (let column = 0; column < this._tiles.columns; column++) {
      for (let row = 0; row < this._tiles.rows; row++) {
        this._tilesGroup.push({ column, row });
      }
    }
    return this._tilesGroup;
  }
}

export default SuperTilesGroupDeterminer;
