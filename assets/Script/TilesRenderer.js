import config from "./Utils/Config";
import Tile from "./Tile";
import Renderer from "./Models/Renderer";
import Position from "./Models/Position";

const TilesRenderer = cc.Class({
  name: "TilesRenderer",
  extends: cc.Component,

  onLoad() {
    this._mask = this.node.parent.getChildByName("Mask");
  },

  createRendererInterface() {
    return new Renderer(this, {
      drawElementCallback: this.drawTile,
      destroyElementCallback: this.destroyTile,
      moveElementCallback: this.moveTile,
    });
  },

  drawTile(tile, position, options, callback) {
    if (!position) throw new Error("Position is need to be defined.");
    const { isSuper } = tile.getComponent(Tile);
    const { column, row } = position;
    tile.zIndex = isSuper ? 100 : row;
    tile.setScale(isSuper ? config.tileScaleSize * 3 : config.tileScaleSize);
    tile.setPosition(column * config.tileWidth, row * config.tileHeight);
    tile.getComponent(Tile).position = new Position(column, row);
    this._mask.addChild(tile);
    if (isSuper) {
      cc.tween(tile)
        .to(0.5, {
          scale: config.tileScaleSize,
          angle: 1080,
        })
        .call(() => {
          tile.zIndex = position.row;
          callback();
        })
        .start();
    } else callback();
  },
  moveTile(tile, position, options, callback) {
    const { column, row } = position;
    tile.zIndex = row;
    tile.getComponent(Tile).position = new Position(column, row);
    cc.tween(tile)
      .to(0.5, {
        position: cc.v2(column * config.tileWidth, row * config.tileHeight),
      })
      .call(() => {
        callback();
      })
      .start();
  },
  destroyTile(tile, options, callback) {
    cc.tween(tile)
      .to(0.3, {
        scale: 0,
      })
      .call(() => {
        this._mask.removeChild(tile);
        callback();
      })
      .start();
  },
});
export default TilesRenderer;
