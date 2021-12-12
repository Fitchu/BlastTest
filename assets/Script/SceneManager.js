cc.Class({
  extends: cc.Component,
  start() {
    cc.Camera.main.backgroundColor = cc.color(90, 90, 90);
  },
  loadGame() {
    cc.director.loadScene("Game");
  },

  loadMain() {
    cc.director.loadScene("Main");
  },
  loadGameOver(message) {
    cc.director.loadScene("GameOver", (err, scene) => {
      const label = cc.find("Canvas/GameOver_Label").getComponent(cc.Label);
      label.string = message;
    });
  },
});
