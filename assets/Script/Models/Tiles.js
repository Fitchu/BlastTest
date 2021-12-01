import { get } from "lodash";
import TilesGroup from "./TilesGroup";

class Tiles {
  constructor(width, height, minTilesGroupLength, renderer) {
    this._width = width;
    this.tiles = new Array(this._width);
    this._height = height;
    this._minTilesGroupLength = minTilesGroupLength;
    this._tilesGroup = new TilesGroup(this);
    this._renderer = renderer;
    for (let x = 0; x < this._width; x++) {
      this.tiles[x] = new Array(this._height);
      for (let y = 0; y < this._height; y++) {
        this.set(x, y, this._renderer.createNodeChild(x, y));
      }
    }
  }
  get(x, y) {
    return this.tiles[x][y];
  }
  set(x, y, value) {
    this.tiles[x][y] = value;
  }
  hasTilesGroup() {}
  determineTilesGroup(x, y, color) {
    if (
      this._tilesGroup.find((tile) => tile.x === x && tile.y === y) ||
      color !== get(this.tiles, `[${x}][${y}].name`)
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
        this._renderer.node.removeChild(this.get(tile.x, tile.y));
        this.tiles[tile.x].splice(tile.y, 1, null);
      });
    } else {
      this._tilesGroup = new TilesGroup(this);
    }
    return this;
  }

  displaceTiles() {
    for (const [x, y] of Object.entries(this._tilesGroup.minYByX)) {
      let diff = 0;
      let countToGenerate = 1;
      this.set(
        x,
        this._height + countToGenerate - 1,
        this._renderer.createNodeChild(
          x,
          this._height + countToGenerate - 1,
          true
        )
      );

      for (let ynext = y + 1; ynext < this._height + countToGenerate; ynext++) {
        diff++;
        const tile = this.get(x, ynext);
        if (tile) {
          this.set(x, ynext - diff, tile);
          const displacedTile = this.get(x, ynext - diff);

          if (ynext >= this._height) {
            this._renderer.node.addChild(displacedTile);
          } else this.tiles[x].splice(ynext, 1, null);
          displacedTile.setPosition(x * 40, (ynext - diff) * 40);
          diff--;
        } else {
          countToGenerate++;
          const generatedTile = this._renderer.createNodeChild(
            x,
            this._height + countToGenerate - 1,
            true
          );

          this.set(x, this._height + countToGenerate - 1, generatedTile);
        }
      }
      while (this.get(x, this._height)) {
        this.tiles[x].splice(this._height, 1);
      }
    }
    this._tilesGroup = new TilesGroup(this);
    return this;
  }
}

module.exports = Tiles;
