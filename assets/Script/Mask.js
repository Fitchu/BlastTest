const Mask = cc.Class({
  extends: cc.Component,

  onLoad() {
    const { width, height, anchorX, anchorY } = this.node.parent;
    this.node.width = width;
    this.node.height = height - 10;
    this.node.anchorX = anchorX;
    this.node.anchorY = anchorY;
  },
});

export default Mask;
