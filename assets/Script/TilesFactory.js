import Utils from "./Utils/Utils";
import Tile from "./Tile";
import Area from "./Area";

const TilesFactory = cc.Class({
  name: "TilesFactory",
  extends: cc.Component,
  properties: {
    colorsAmount: {
      default: 4,
      type: cc.Integer,
      displayName: "(C) Amount colors:",
    },
    _tileColorsPool: {
      type: [cc.Prefab],
      default: [],
      serializable: false,
    },
    tileColorsPool: {
      get: function () {
        return this._tileColorsPool;
      },
    },
    tilePrefab: {
      type: cc.Prefab,
      default: null,
    },
    _tileColors: {
      type: [cc.SpriteFrame],
      default: null,
    },
    superTileColor: {
      get: function () {
        return this._superTileColor;
      },
    },
    _superTileColor: {
      type: cc.SpriteFrame,
      default: null,
    },
  },

  onLoad() {
    TilesFactory.instance = this;
    cc.resources.loadDir("tiles", cc.SpriteFrame, function (err, assets, urls) {
      TilesFactory.instance._superTileColor = assets.find(
        (asset) => asset.name === "Super"
      );
      TilesFactory.instance._tileColors = [
        ...assets.filter((asset) => asset.name !== "Super"),
      ];
      TilesFactory.instance.node.getComponent(TilesFactory).setRandomTiles();
      cc.log(TilesFactory.instance);
      TilesFactory.instance.node.parent.getComponent(Area).init();
    });
  },

  statics: {
    instance: null,
    createTile(options = {}) {
      const { superTile } = options;
      const tile = cc.instantiate(this.instance.tilePrefab);
      const sprite = superTile
        ? this.instance.superTileColor
        : this.instance.tileColorsPool[
            Utils.getRandomNumber(this.instance.colorsAmount)
          ];
      tile.name = sprite.name;
      tile.getComponent(cc.Sprite).spriteFrame = sprite;
      tile.getComponent(Tile).isSuper = !!superTile;

      return tile;
    },
  },

  setRandomTiles() {
    cc.log("random");
    let arr = Array.from(Array(this._tileColors.length).keys());
    for (let i = 0; i < this.colorsAmount; i++) {
      const randomIndex = Utils.getRandomNumber(arr.length - 1);
      this._tileColorsPool.push(this._tileColors[arr[randomIndex]]);
      arr.splice(randomIndex, 1);
    }
  },
});

export default TilesFactory;
