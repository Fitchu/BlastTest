const config = require("config");
import Tiles from "./Models/Tiles";
import Renderer from "./Models/Renderer";

cc.Class({
  extends: cc.Component,

  properties: {
    areaWidth: {
      default: 5,
      displayName: "(N) Area width:",
      type: cc.Integer,
    },
    areaHeight: {
      default: 5,
      displayName: "(M) Area height:",
      type: cc.Integer,
    },
    colorsAmount: {
      default: 4,
      type: cc.Integer,
      displayName: "(C) Amount colors:",
    },
    minTilesInGroup: {
      default: 2,
      type: cc.Integer,
      displayName: "(K) Min. tiles in the group",
    },
    maxMixes: {
      default: 2,
      type: cc.Integer,
      displayName: "(S) Mixing tiles count",
    },
    explosionRadius: {
      default: 3,
      type: cc.Integer,
      displayName: "(R) Explosion radius",
    },
    tilesGroupLengthForSuperTile: {
      default: 7,
      type: cc.Integer,
      displayName:
        "(L) Min. length of destroyed tiles group for generation Super Tile",
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
    _tiles: {
      type: Tiles,
      default: null,
      serializable: false,
    },
    _booster: {
      default: "",
    },
  },

  onLoad() {
    this.node.on("click", this.handleClick, this);
    this.node.width = this.areaWidth * config.tileWidth + 25;
    this.node.height = this.areaHeight * config.tileHeight + 25;
    this.node.anchorX = (config.tileWidth + 25) / 2 / this.node.width;
    this.node.anchorY = (config.tileHeight + 25) / 2 / this.node.height;
  },
  start() {
    this.setRandomTiles();
    const renderer = new Renderer(this, {
      createElementCallback: this.createNodeChild,
      renderElementCallback: this.renderNode,
      destroyElementCallback: this.destroyNode,
      moveElementCallback: this.moveNode,
      dispatchEventCallback: (event) => this.node.dispatchEvent(event),
    });
    this._tiles = new Tiles(
      this.areaWidth,
      this.areaHeight,
      this.minTilesInGroup,
      this.maxMixes,
      this.explosionRadius,
      this.tilesGroupLengthForSuperTile,
      renderer
    );
  },
  renderNode(node, position) {
    if (position) {
      const { x, y } = position;
      node.zIndex = y;
      node.setPosition(x * config.tileWidth, y * config.tileHeight);
    }
    this.node.addChild(node);
  },
  moveNode(node, position) {
    const { x, y } = position;
    node.zIndex = y;
    cc.tween(node)
      .to(0.5, {
        position: cc.v2(x * config.tileWidth, y * config.tileHeight),
      })
      .start();
  },
  destroyNode(node) {
    cc.log(node);
    cc.tween(node)
      .to(0.3, {
        scale: 0,
        position: cc.v2(node.x, node.y),
      })
      .call(() => {
        this.node.removeChild(node);
      })
      .start();
  },

  createNodeChild(isSuper) {
    const nodeChild = isSuper
      ? cc.instantiate(this.superTile)
      : cc.instantiate(
          this._chooseTiles[this.getRandomNumber(this.colorsAmount)]
        );
    nodeChild.setScale(config.tileScaleSize);
    return nodeChild;
  },

  handleClick(event) {
    const x = Math.abs(event.target.x / config.tileWidth);
    const y = Math.abs(event.target.y / config.tileHeight);
    event.stopPropagation();

    if (this._booster === "teleport") {
      if (!this._source) {
        this._source = { tile: event.target, position: { x, y } };
        this._source.tile.opacity = 128;
      } else {
        this.swapTiles(this._source, {
          tile: event.target,
          position: { x, y },
        });
        this._booster = "";
        this._source = null;
      }
    } else {
      this.determineTilesGroup(event.target, x, y)
        .destroyTilesGroup(!(this._booster === "bomb" || event.target.isSuper))
        .displaceTiles();
      this._booster = "";
    }
  },

  swapTiles(source, destination) {
    source.tile.opacity = 255;
    this._tiles.set(source.position.x, source.position.y, destination.tile);
    this._tiles.set(
      destination.position.x,
      destination.position.y,
      source.tile
    );
    this.moveNode(source.tile, destination.position);
    this.moveNode(destination.tile, source.position);
  },

  setRandomTiles() {
    let arr = Array.from(Array(this.tilePrefabs.length).keys());
    for (let i = 0; i < this.colorsAmount; i++) {
      this._chooseTiles.push(
        this.tilePrefabs[arr.splice(this.getRandomNumber(arr.length), 1)[0]]
      );
    }
  },
  determineTilesGroup(tile, x, y) {
    return tile.isSuper
      ? this._tiles.determineTilesGroupForSuperTile(
          x,
          y,
          this._booster === "bomb"
        )
      : this._booster === "bomb"
      ? this._tiles.determineTilesGroupByRadius(x, y)
      : this._tiles.determineTilesGroup(x, y, tile.name);
  },
  getDetermineMethodName(tile) {
    if (tile.isSuper) return "determineTilesGroupForSuperTile";
    return `determineTilesGroup${this._booster === "bomb" ? "ByRadius" : ""}`;
  },
  getRandomNumber(number) {
    return Math.floor(Math.random() * number);
  },
  setBooster(event, name) {
    this._booster = name;
  },
  onDestroy() {
    this.node.off("click", this.handleClick, this);
  },
});
