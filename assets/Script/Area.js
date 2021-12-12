import Tiles from "./Models/Tiles";
import GameManager from "./GameManager/GameManager";
import TilesRenderer from "./TilesRenderer";
import config from "./Utils/Config";

const Area = cc.Class({
  extends: cc.Component,

  properties: {
    width: {
      default: 5,
      displayName: "(N) Area width:",
      type: cc.Integer,
    },
    height: {
      default: 5,
      displayName: "(M) Area height:",
      type: cc.Integer,
    },

    _tiles: {
      type: Tiles,
      default: null,
      serializable: false,
    },
    gameManagerNode: {
      type: cc.Node,
      default: null,
    },
    tilesRendererNode: {
      type: cc.Node,
      default: null,
    },
  },

  onLoad() {
    this._gameManager = this.gameManagerNode.getComponent(GameManager);
    this._renderer = this.tilesRendererNode.getComponent(TilesRenderer);

    this.node.on("tileClick", this._gameManager.onTileClick, this._gameManager);
    this.node.on(
      "maxMixesReached",
      this._gameManager.handleMaxMixesReached,
      this._gameManager
    );
    this.node.on(
      "tilesGroupDestroyed",
      this._gameManager.handleScoreUp,
      this._gameManager
    );
    this.node.width = this.width * config.tileWidth + 25;
    this.node.height = this.height * config.tileHeight + 25;
    this.node.anchorX = (config.tileWidth + 25) / 2 / this.node.width;
    this.node.anchorY = (config.tileHeight + 25) / 2 / this.node.height;
  },
  init() {
    const tilesOptions = this._gameManager.getTilesOptions();
    const renderer = this._renderer.createRendererInterface();
    this._tiles = new Tiles(this.width, this.height, renderer, tilesOptions);
    this._gameManager.setTiles(this._tiles);
  },

  onDestroy() {
    this.node.off(
      "tileClick",
      this._gameManager.onTileClick,
      this._gameManager
    );
    this.node.off(
      "maxMixesReached",
      this._gameManager.handleMaxMixesReached,
      this._gameManager
    );
    this.node.off(
      "tilesGroupDestroyed",
      this._gameManager.handleScoreUp,
      this._gameManager
    );
  },
});
export default Area;
