cc.Class({
  extends: cc.Component,
  
  properties: {
  },
  onLoad() {
    var self = this;
    var url = "Tile/Red";
    cc.resources.load(url, cc.SpriteFrame, null, function (err, spriteFrame) {
      self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
  },
  start() {
    this.node.on(cc.Node.EventType.TOUCH_END, () => {
       cc.log("click");
    })
  },
});