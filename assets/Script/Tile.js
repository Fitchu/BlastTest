import Position from "./Models/Position";

cc.Class({
  extends: cc.Component,

  properties: {
    position: {
      type: Position,
      default: null,
    },
    isSuper: {
      type: cc.Boolean,
      default: false,
    },
  },
  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_END, this.dispatchEventClick, this);
  },
  dispatchEventClick() {
    this.node.dispatchEvent(new cc.Event.EventCustom("tileClick", true));
  },
  start() {},
  setActive(active) {
    if (active) this.node.opacity = 128;
    else this.node.opacity = 255;
  },
  onDestroy() {
    this.node.off(cc.Node.EventType.TOUCH_END, this.dispatchEventClick, this);
  },
});
