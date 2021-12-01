var config = require("config");

import Tiles from "./Models/Tiles";

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
    Tile_Prefabs: {
      type: [cc.Prefab],
      default: [],
    },
    _chooseTiles: {
      type: [cc.Prefab],
      default: [],
      serializable: false,
    },
    tiles: {
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
    /// НАДО СОЗДАТЬ КЛАСС Renderer и функцию мапинга для функций рендеринга
    this.tiles = new Tiles(
      this.areaWidth,
      this.areaHeight,
      this.minTilesInGroup,
      this
    );
  },
  createTest(x, y, test, withoutRendering = false) {
    const nodeChild = cc.instantiate(this.Tile_Prefabs[test]);
    nodeChild.setScale(config.tileScaleSize);
    if (!withoutRendering) this.renderNode(x, y, nodeChild);
    return nodeChild;
  },
  createNodeChild(x, y, withoutRendering = false) {
    const nodeChild = cc.instantiate(
      this._chooseTiles[this.getRandomNumber(this.colorsAmount)]
    );
    nodeChild.setScale(config.tileScaleSize);
    if (!withoutRendering) this.renderNode(x, y, nodeChild);
    return nodeChild;
  },

  renderNode(x, y, nodeChild) {
    nodeChild.setPosition(x * config.tileWidth, y * config.tileHeight);
    this.node.addChild(nodeChild);
  },

  handleClick(event) {
    const x = Math.abs(event.target.x / config.tileWidth);
    const y = Math.abs(event.target.y / config.tileHeight);

    const renderer = {
      setPosition: (node, x, y) => {
        node.setPosition(x * config.tileWidth, y * config.tileHeight);
      },
      addChildToNode: (child) => {
        this.node.addChild(child);
      },
    };
    this.tiles
      .determineTilesGroup(x, y, event.target.name)
      .destroyTilesGroup()
      .displaceTiles();
  },

  setRandomTiles() {
    let arr = Array.from(Array(this.Tile_Prefabs.length).keys());
    for (let i = 0; i < this.colorsAmount; i++) {
      this._chooseTiles.push(
        this.Tile_Prefabs[arr.splice(this.getRandomNumber(arr.length), 1)[0]]
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
