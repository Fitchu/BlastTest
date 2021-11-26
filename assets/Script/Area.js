cc.Class({
  extends: cc.Component,
  
  properties: {
    Tile_Prefab:cc.Prefab,
  },
  onLoad() {
    cc.log("load");
    this.Spawn();
  },
  Spawn() {
    let tile = cc.instantiate(this.Tile_Prefab)
    tile.parent = this.node.parent;
    tile.setPosition(this.node.getPosition());
    cc.log("test")
  }
});