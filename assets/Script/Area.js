cc.Class({
  extends: cc.Component,

  properties: {
    N: {
      default: 5,
      displayName: "Area width",
      type: cc.Integer,
    },
    M: {
      default: 5,
      displayName: "Area height",
      type: cc.Integer,
    },
    Tile_Prefab: {
      default: null,
      type: cc.Prefab,
    },
  },
  start() {
    this.tiles = new Array(this.N);
    for (let x = 0; x < this.N; x++) {
      this.tiles[x] = new Array(this.M);
    }
    this.Spawn();
  },
  Spawn() {
    for (let x = 0; x < this.N; x++) {
      for (let y = 0; y < this.M; y++) {
        this.tiles[x][y] = cc.instantiate(this.Tile_Prefab);
        this.node.addChild(this.tiles[x][y]);
        this.tiles[x][y].setPosition(x * 40, y * -45);
      }
    }
  },
});
