var config = require("config");
cc.Class({
  extends: cc.Component,

  properties: {},
  onLoad() {
    var self = this;
    var url = "Tile/Red";
    cc.resources.load(url, cc.SpriteFrame, function (err, spriteFrame) {
      self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });

    this.node.setScale(config.tileScaleSize);
    this.node.on(cc.Node.EventType.TOUCH_END, () => {
      cc.log(
        "coordinate: ",
        Math.abs(this.node.x / 40),
        Math.abs(this.node.y / 45)
      );
    });
  },
  start() {},
  onDestroy() {
    this.node.off(cc.Node.EventType.TOUCH_END);
    cc.log("destroy");
  },
});
