import config from "./Config";
import Tile from "./Tile";
import Renderer from "./Models/Renderer";
import Position from "./Models/Position";

cc.Class({
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
  },

  onLoad() {
    this._area = this.node.parent;
    cc.log(this._area);
  },

  createRendererInterface() {
    return new Renderer(this, {
      createElementCallback: this.createTile,
      renderElementCallback: this.renderTile,
      destroyElementCallback: this.destroyTile,
      moveElementCallback: this.moveTile,
      dispatchEventCallback: (event) => this.node.dispatchEvent(event),
    });
  },

  setOpacity(tile, opacity) {
    tile.opacity = opacity;
  },

  renderTile(tile, position) {
    if (position) {
      const { column, row } = position;
      tile.zIndex = row;
      tile.setPosition(column * config.tileWidth, row * config.tileHeight);
      tile.getComponent(Tile).position = new Position(column, row);
    }
    this._area.addChild(tile);
  },
  moveTile(tile, position) {
    const { column, row } = position;
    tile.zIndex = row;
    tile.getComponent(Tile).position = new Position(column, row);
    cc.tween(tile)
      .to(0.5, {
        position: cc.v2(column * config.tileWidth, row * config.tileHeight),
      })
      .start();
  },
  destroyTile(tile) {
    cc.tween(tile)
      .to(0.3, {
        scale: 0,
        position: cc.v2(tile.x, tile.y),
      })
      .call(() => {
        this._area.removeChild(tile);
      })
      .start();
  },

  createTile(isSuper) {
    const tile = isSuper
      ? cc.instantiate(this.superTile)
      : cc.instantiate(
          this._chooseTiles[this.getRandomNumber(this.colorsAmount)]
        );
    tile.getComponent(Tile).isSuper = isSuper;
    tile.setScale(config.tileScaleSize);
    return tile;
  },

  setRandomTiles() {
    let arr = Array.from(Array(this.tilePrefabs.length).keys());
    for (let i = 0; i < this.colorsAmount; i++) {
      this._chooseTiles.push(
        this.tilePrefabs[arr.splice(this.getRandomNumber(arr.length), 1)[0]]
      );
    }
  },

  getRandomNumber(number) {
    return Math.floor(Math.random() * number);
  },
});
