import TilesGroup from "./TilesGroup";
import TilesGroupDeterminer from "./TilesGroupDeterminers/TilesGroupDeterminer";
import Position from "./Position";
import Tile from "../Tile";

class Tiles {
  constructor(columns, rows, renderer, options) {
    this._columns = columns;
    this._rows = rows;
    this._renderer = renderer;

    const { minTilesGroupLength, maxMixes, tilesGroupLengthForSuperTile } =
      options;
    this._minTilesGroupLength = minTilesGroupLength;
    this._maxMixes = maxMixes;
    this._tilesGroupLengthForSuperTile = tilesGroupLengthForSuperTile;

    this._tiles = new Array(this._columns);
    this._defaultDeterminer = new TilesGroupDeterminer(this);
    this._tilesGroup = new TilesGroup(this);
    this.init();
  }

  get(position) {
    const { column, row } = position;
    return this._tiles[column][row];
  }
  set(position, value) {
    const { column, row } = position;
    this._tiles[column][row] = value;
  }

  get columns() {
    return this._columns;
  }

  get rows() {
    return this._rows;
  }

  get tiles() {
    return this._tiles;
  }

  get size() {
    return this._columns * this._rows;
  }

  init() {
    do {
      for (let column = 0; column < this._columns; column++) {
        this._tiles[column] = new Array(this._rows);
        for (let row = 0; row < this._rows; row++) {
          const tile = this._renderer.createElement();
          this.set(new Position(column, row), tile);
        }
      }
    } while (!this.hasTilesGroup());

    for (let column = 0; column < this._columns; column++) {
      for (let row = 0; row < this._rows; row++) {
        const position = new Position(column, row);
        this._renderer.renderElement(this.get(position), position);
      }
    }
  }

  getTileCoordinatesByNumber(number) {
    const column = Math.floor(number / this._columns);
    const row = number % this._columns;
    return new Position(column, row);
  }
  hasTilesGroup() {
    for (let column = 0; column < this._columns; column++) {
      for (let row = 0; row < this._rows; row++) {
        this.determineTilesGroup(
          { column, row },
          this.get({ column, row }).name
        );
        if (this._tilesGroup.length >= this._minTilesGroupLength) {
          this._tilesGroup = new TilesGroup(this);
          return true;
        }
        this._tilesGroup = new TilesGroup(this);
      }
    }
    return false;
  }

  mixOnce() {
    const halfOfTiles = this.size / 2;
    for (let i = 0; i <= halfOfTiles; i++) {
      const firstTilePoint = this.getTileCoordinatesByNumber(i);

      const secondTilePoint = this.getTileCoordinatesByNumber(
        Math.floor((Math.random() * this.size) / 2 + halfOfTiles)
      );
      const firstTilePosition = new Position(
        firstTilePoint.column,
        firstTilePoint.row
      );

      const secondTilePosition = new Position(
        secondTilePoint.column,
        secondTilePoint.row
      );

      const firstTile = this.get(firstTilePosition);
      const secondTile = this.get(secondTilePosition);
      this.set(secondTilePosition, firstTile);
      this.set(firstTilePosition, secondTile);
      this._renderer.moveElement(firstTile, secondTilePoint);
      this._renderer.moveElement(secondTile, firstTilePoint);
    }
  }

  mix() {
    let mixCount = 0;
    while (!this.hasTilesGroup() && mixCount < this._maxMixes) {
      this.mixOnce();
      mixCount++;
    }
    if (!this.hasTilesGroup()) {
      this._renderer.dispatchEvent(
        new cc.Event.EventCustom("maxMixesReached", true)
      );
    }
  }

  useTilesGroupDeterminer(determiner) {
    this._determiner = determiner;
    return this;
  }

  determineTilesGroup(...args) {
    const determiner = this._determiner ?? this._defaultDeterminer;
    this._tilesGroup = determiner.determineTilesGroup(...args);
    determiner.clear();
    return this._tilesGroup;
  }

  destroy() {
    if (this._tilesGroup.length >= this._minTilesGroupLength) {
      const tilesCount = this._tilesGroup.length;
      this._tilesGroup.forEach((tile) => {
        this._renderer.destroyElement(
          this.get({ column: tile.column, row: tile.row })
        );
        this._tiles[tile.column].splice(tile.row, 1, null);
      });
      this.dispatchTilesGroupDestroyed(tilesCount);
    } else {
      this._tilesGroup = new TilesGroup(this);
    }
    return this;
  }
  dispatchTilesGroupDestroyed(count) {
    const event = new cc.Event.EventCustom("tilesGroupDestroyed", true);
    event.setUserData({ count });
    this._renderer.dispatchEvent(event);
  }
  generate(withSuperTile = true) {
    if (
      withSuperTile &&
      this._tilesGroup.length >= this._tilesGroupLengthForSuperTile
    ) {
      const superTile = this._renderer.createElement(withSuperTile);
      this._renderer.renderElement(superTile, this._tilesGroup.head);
      this.set(this._tilesGroup.head, superTile);
      this._tilesGroup.decapitate();
    }
    for (const [column, count] of Object.entries(
      this._tilesGroup.destroyedCountByX
    )) {
      for (let row = this._rows; row < this._rows + count; row++)
        this.set(new Position(column, row), this._renderer.createElement());
    }
    return this;
  }
  displace() {
    for (const [column, row] of Object.entries(this._tilesGroup.minYByX)) {
      let diff = 0;
      for (
        let nextRow = row + 1;
        nextRow < this._rows + this._tilesGroup.destroyedCountByX[column];
        nextRow++
      ) {
        diff++;
        const tile = this.get({ column, row: nextRow });
        if (tile) {
          const displacedPosition = new Position(column, nextRow - diff);
          this.set(displacedPosition, tile);
          const displacedTile = this.get(displacedPosition);

          if (nextRow >= this._rows) {
            this._renderer.renderElement(
              displacedTile,
              new Position(column, nextRow)
            );
          } else this._tiles[column].splice(nextRow, 1, null);
          this._renderer.moveElement(displacedTile, displacedPosition);
          diff--;
        }
      }
      while (this.get({ column, row: this._rows })) {
        this._tiles[column].splice(this._rows, 1);
      }
    }
    if (this._tilesGroup.length) {
      this._tilesGroup = new TilesGroup(this);
      this.mix();
    }
    return this;
  }

  swap(source, destination) {
    this.set(source.position, destination.tile);
    this.set(destination.position, source.tile);
    this._renderer.moveElement(source.tile, destination.position);
    this._renderer.moveElement(destination.tile, source.position);
  }
}

module.exports = Tiles;
