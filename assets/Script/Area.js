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
    totalMixCount: {
      default: 2,
      type: cc.Integer,
      displayName: "(S) Mixing tiles count",
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
      renderElementCallback: (child, position) => {
        if (position) {
          const { x, y } = position;
          child.setPosition(x * config.tileWidth, y * config.tileHeight);
        }
        this.node.addChild(child);
      },
      destroyElementCallback: this.destroyNode,
      moveElementCallback: this.moveNode,
      dispatchEventCallback: (event) => this.node.dispatchEvent(event),
    });
    this._tiles = new Tiles(
      this.areaWidth,
      this.areaHeight,
      this.minTilesInGroup,
      this.totalMixCount,
      renderer
    );
  },
  moveNode(node, position) {
    const { x, y } = position;
    cc.tween(node)
      .to(0.75, {
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
    const nodeChild = cc.instantiate(this.Tile_Prefabs[test]);
    nodeChild.setScale(config.tileScaleSize);
    if (!withoutRendering) this.renderNode(x, y, nodeChild);
    return nodeChild;
  },
  createNodeChild() {
    const nodeChild = cc.instantiate(
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
