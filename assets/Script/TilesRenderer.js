import config from "./Utils/Config";
import Utils from "./Utils/Utils";
import Tile from "./Tile";
import Renderer from "./Models/Renderer";
import Position from "./Models/Position";

const TilesRenderer = cc.Class({
  name: "TilesRenderer",
  extends: cc.Component,
  properties: {
    colorsAmount: {
      default: 4,
      type: cc.Integer,
      displayName: "(C) Amount colors:",
    },
    tilePrefabs: {
      type: [cc.Prefab],
      default: [],
    },
    superTile: {
      type: cc.Prefab,
      default: null,
    },
    _chooseTiles: {
      type: [cc.Prefab],
      default: [],
      serializable: false,
    },
    _animationInProgressCount: {
      type: cc.Integer,
      default: 0,
    },
  },

  onLoad() {
    this._area = this.node.parent;
  },

  createRendererInterface() {
    return new Renderer(this, {
      createElementCallback: this.createTile,
      drawElementCallback: this.drawTile,
      destroyElementCallback: this.destroyTile,
      moveElementCallback: this.moveTile,
      dispatchEventCallback: (event) => this.node.dispatchEvent(event),
    });
  },

  drawTile(tile, position) {
    if (position) {
      const { column, row } = position;
      tile.zIndex = row;
      tile.setPosition(column * config.tileWidth, row * config.tileHeight);
      tile.getComponent(Tile).position = new Position(column, row);
    }
    this._area.addChild(tile);
  },
  moveTile(tile, position, callback) {
    const { column, row } = position;
    tile.zIndex = row;
    tile.getComponent(Tile).position = new Position(column, row);
    this._animationInProgressCount++;
    cc.tween(tile)
      .to(0.5, {
        position: cc.v2(column * config.tileWidth, row * config.tileHeight),
      })
      .call(() => {
        this._animationInProgressCount--;
        callback();
      })
      .start();
  },
  destroyTile(tile, callback) {
    this._animationInProgressCount++;
    cc.tween(tile)
      .to(0.3, {
        scale: 0,
      })
      .call(() => {
        this._animationInProgressCount--;
        this._area.removeChild(tile);
        callback();
      })
      .start();
  },

  createTile(isSuper) {
    const tile = isSuper
      ? cc.instantiate(this.superTile)
      : cc.instantiate(
          this._chooseTiles[Utils.getRandomNumber(this.colorsAmount)]
        );
    tile.getComponent(Tile).isSuper = !!isSuper;
    tile.setScale(config.tileScaleSize);
    return tile;
  },

  setRandomTiles() {
    let arr = Array.from(Array(this.tilePrefabs.length).keys());
    for (let i = 0; i < this.colorsAmount; i++) {
      this._chooseTiles.push(
        this.tilePrefabs[arr.splice(Utils.getRandomNumber(arr.length), 1)[0]]
      );
    }
  },

  isAnimationInProgress() {
    return Boolean(this._animationInProgressCount);
  },
});
export default TilesRenderer;
