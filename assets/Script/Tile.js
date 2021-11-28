cc.Class({
  extends: cc.Component,

  properties: {},
  onLoad() {
    var self = this;
    var url = "Tile/Red";
    cc.resources.load(url, cc.SpriteFrame, function (err, spriteFrame) {
      spriteFrame.width = 45;
      spriteFrame.height = 45;
      self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });

    this.node.setScale(0.23, 0.23);
    this.node.on(cc.Node.EventType.TOUCH_END, () => {
      cc.log("click");
    });
  },
  start() {},
  onDestroy() {
    this.node.off(cc.Node.EventType.TOUCH_END);
    cc.log("destroy");
  },
});
