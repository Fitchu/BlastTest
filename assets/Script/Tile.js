cc.Class({
  extends: cc.Component,

  properties: {},
  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_END, () => {
      const event = new cc.Event.EventCustom("click", true);
      this.node.dispatchEvent(event);
    });
  },
  start() {},
  onDestroy() {
    this.node.off(cc.Node.EventType.TOUCH_END);
  },
});
