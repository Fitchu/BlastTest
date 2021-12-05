cc.Class({
  extends: cc.Component,
  onLoad() {
    cc.game.addPersistRootNode(this.node);
  },
  onDestroy() {
    cc.game.removePersistRootNode(this.node);
  },
});
