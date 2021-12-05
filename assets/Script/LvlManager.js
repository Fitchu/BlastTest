cc.Class({
  extends: cc.Component,

  properties: {},
  onLoad() {},
  start() {
    const scene = cc.director.getScene();
    if (scene.name == "Game") {
      this.node.on("gameOver", this.handleGameOver, this);
    }
  },
  loadGame() {
    cc.director.loadScene("Game");
  },
  loadMain() {
    cc.director.loadScene("Main");
  },
  handleGameOver(event) {
    event.stopPropagation();
    this.node.off("gameOver", this.handleGameOver, this);
    cc.log("game-over:", event);
    cc.director.loadScene("GameOver", this.checkGameOver(event));
  },
  checkGameOver(data) {
    cc.log("ForGameOver", data);
  },
});
