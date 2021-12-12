const EventDispatcher = cc.Class({
  name: "EventDispatcher",
  extends: cc.Component,

  onLoad() {
    EventDispatcher.node = this.node;
  },

  statics: {
    node: null,
    dispatchEvent(event, ...args) {
      this.node.dispatchEvent(event);
    }
  },
  
});

export default EventDispatcher;
