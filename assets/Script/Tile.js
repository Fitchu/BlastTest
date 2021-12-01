cc.Class({
  extends: cc.Component,

  properties: {},
  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_END, () => {
      this.node.dispatchEvent(new cc.Event.EventCustom("click", true));
    });
  },
  start() {},
  onDestroy() {
    this.node.off(cc.Node.EventType.TOUCH_END);
  },
});
