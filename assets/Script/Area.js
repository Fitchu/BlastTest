import Tiles from "./Models/Tiles";
import GameManager from "./GameManager/GameManager";
import TilesRenderer from "./TilesRenderer";
import config from "./Config";

cc.Class({
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
    _gameManager: {
      type: GameManager,
      default: null,
    },
    _renderer: {
      type: TilesRenderer,
      default: null,
    },
  },

  onLoad() {
    this._gameManager = cc.find("GameManager").getComponent(GameManager);
    this._renderer = this.node
      .getChildByName("TilesRenderer")
      .getComponent(TilesRenderer);

    this.node.on("tileClick", this._gameManager.onTileClick, this._gameManager);
    this.node.width = this.width * config.tileWidth + 25;
    this.node.height = this.height * config.tileHeight + 25;
    this.node.anchorX = (config.tileWidth + 25) / 2 / this.node.width;
    this.node.anchorY = (config.tileHeight + 25) / 2 / this.node.height;
  },
  start() {
    this._renderer.setRandomTiles();
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
  },
});
