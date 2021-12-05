cc.Class({
  extends: cc.Component,

  loadGame() {
    cc.director.loadScene("Game");
  },
  loadMain() {
    cc.director.loadScene("Main");
  },
  handleGameOver(score, result) {
    cc.director.loadScene("GameOver", (err, scene) => {
      const label = cc.find("Canvas/GameOver_Label").getComponent(cc.Label);
      label.string = `${result ? "Победа" : "Поражение"}. Ваш счет: ${score}`;
    });
  },
});
