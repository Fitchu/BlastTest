import { get } from "lodash";
import TilesGroup from "./TilesGroup";

class Tiles {
  constructor(columns, rows, minTilesGroupLength, totalMixCount, renderer) {
    this._columns = columns;
    this._rows = rows;
    this._tiles = new Array(this._columns);
    this._minTilesGroupLength = minTilesGroupLength;
    this._tilesGroup = new TilesGroup(this);
    this._totalMixCount = totalMixCount;
    this._mixCount = 0;
    this._renderer = renderer;

    //do {ПРОВЕРКА НА НАЛИЧИЕ ГРУПП
    for (let x = 0; x < this._columns; x++) {
      this._tiles[x] = new Array(this._rows);
      for (let y = 0; y < this._rows; y++) {
        const tile = this._renderer.createElement();
        this.set(x, y, tile);
        this._renderer.renderElement(tile, { x, y });
      }
    }
    //} while (!this.hasTilesGroup());
  }
  get(x, y) {
    return this._tiles[x][y];
  }
  set(x, y, value) {
    this._tiles[x][y] = value;
  }
  getTileCoordinatesByNumber(number) {
    const row = Math.floor(number / this._rows);
    const column = number % this._rows;
    return { x: row, y: column };
  }
  mixTiles() {
    for (let i = 0; i <= (this._rows * this._columns) / 2; i++) {
      const firstTilePoint = this.getTileCoordinatesByNumber(i);

      const secondTilePoint = this.getTileCoordinatesByNumber(
        Math.floor(
          (Math.random() * (this._rows * this._columns)) / 2 +
            (this._rows * this._columns) / 2
        )
      );
      const firstTile = this.get(firstTilePoint.x, firstTilePoint.y);
      const secondTile = this.get(secondTilePoint.x, secondTilePoint.y);
      this.set(secondTilePoint.x, secondTilePoint.y, firstTile);
      this.set(firstTilePoint.x, firstTilePoint.y, secondTile);
      this._renderer.moveElement(firstTile, secondTilePoint);
      this._renderer.moveElement(secondTile, firstTilePoint);
    }
  }
  hasTilesGroup() {
    for (let x = 0; x < this._columns; x++) {
      for (let y = 0; y < this._rows; y++) {
        this.determineTilesGroup(x, y, this.get(x, y).name);
        if (this._tilesGroup.length >= this._minTilesGroupLength) return true;
        this._tilesGroup = new TilesGroup(this);
      }
    }
    return false;
  }
  determineTilesGroup(x, y, color) {
    if (
      this._tilesGroup.find((tile) => tile.x === x && tile.y === y) ||
      color !== get(this._tiles, `[${x}][${y}].name`)
    )
      return;

    this._tilesGroup.push({ x, y });
    const points = [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ];
    points.forEach((point) => {
      this.determineTilesGroup(point.x, point.y, color);
    });
    return this;
  }

  destroyTilesGroup() {
    if (this._tilesGroup.length >= this._minTilesGroupLength) {
      this._tilesGroup.forEach((tile) => {
        this._renderer.destroyElement(this.get(tile.x, tile.y));
        this._tiles[tile.x].splice(tile.y, 1, null);
      });
      this.dispatchScoreUp();
    } else {
      this._tilesGroup = new TilesGroup(this);
    }
    return this;
  }
  dispatchScoreUp() {
    if (this._tilesGroup.length) {
      const event = new cc.Event.EventCustom("scoreUp", true);
      event.setUserData({ count: this._tilesGroup.length });
      this._renderer.dispatchEvent(event);
    }
  }
  displaceTiles() {
    for (const [x, y] of Object.entries(this._tilesGroup.minYByX)) {
      let diff = 0;
      let countToGenerate = 1;
      let generatedTile = this._renderer.createElement();
      this._renderer.moveElement(generatedTile, {
        x,
        y: this._rows + countToGenerate - 1,
      });
      this.set(x, this._rows + countToGenerate - 1, generatedTile);

      for (let ynext = y + 1; ynext < this._rows + countToGenerate; ynext++) {
        diff++;
        const tile = this.get(x, ynext);
        if (tile) {
          this.set(x, ynext - diff, tile);
          const displacedTile = this.get(x, ynext - diff);

          if (ynext >= this._rows) {
            this._renderer.renderElement(displacedTile, { x, y: ynext });
          } else this._tiles[x].splice(ynext, 1, null);
          this._renderer.moveElement(displacedTile, { x, y: ynext - diff });
          diff--;
        } else {
          countToGenerate++;
          generatedTile = this._renderer.createElement();
          this._renderer.moveElement(generatedTile, {
            x,
            y: this._rows + countToGenerate - 1,
          });

          this.set(x, this._rows + countToGenerate - 1, generatedTile);
        }
      }
      while (this.get(x, this._rows)) {
        this._tiles[x].splice(this._rows, 1);
      }
    }
    this._tilesGroup = new TilesGroup(this);
    return this;
  }
}

module.exports = Tiles;
