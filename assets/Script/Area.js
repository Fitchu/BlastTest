var config = require("config");
var tests = require("./testconf");
import c from "config";
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
  },

  onLoad() {
    this.node.on("click", this.handleClick, this);
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

  createTest(x, y, test, withoutRendering = false) {
    const nodeChild = cc.instantiate(this.tilePrefabs[test]);
    nodeChild.setScale(config.tileScaleSize);
    if (!withoutRendering) this.renderNode(x, y, nodeChild);
    return nodeChild;
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
    this._tiles
      .determineTilesGroup(x, y, event.target.name)
      .destroyTilesGroup()
      .displaceTiles();
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
  onDestroy() {
    this.node.off("click", this.handleClick, this);
  },
});
