cc.Class({
  extends: cc.Component,

  properties: {
    moveLabel: {
      type: cc.Label,
      default: null,
    },
    scoreLabel: {
      type: cc.Label,
      default: null,
    },
    barSprite: {
      type: cc.Sprite,
      default: null,
    },
    totalMove: {
      type: cc.Integer,
      default: 0,
    },
    totalScrore: {
      type: cc.Integer,
      default: 0,
    },
    _countMove: {
      type: cc.Integer,
      default: 0,
      serializable: false,
    },
    _countScore: {
      type: cc.Integer,
      default: 0,
      serializable: false,
    },
    _sceneManager: {
      type: cc.Node,
      default: null,
    },
  },
  onLoad() {
    this.node.on("maxMixesReached", this.handleMaxMixesReached, this);
    this.node.on("tilesGroupDestroyed", this.handleScoreUp, this);
    this._sceneManager = cc.find("SceneManager").getComponent("SceneManager");
  },

  start() {
    this.barSprite.fillRange = 0;
    this._countMove = this.totalMove;
    this.moveLabel.string = this.totalMove;
  },
  getResult() {
    return `${
      this._countScore >= this.totalScrore ? "Победа" : "Поражение"
    }. Ваш счет: ${this._countScore}`;
  },
  handleScoreUp(event) {
    event.stopPropagation();
    const score = event.getUserData();
    this._countScore += score.count * 10;
    this.fillBar(this._countScore / this.totalScrore);
    this.scoreLabel.string = this._countScore;
    this.moveLabel.string = --this._countMove;

    if (this._countScore < this.totalScrore && this._countMove >= 0) return;
    this._sceneManager.loadGameOver(this.getResult());
  },
  handleMaxMixesReached() {
    this._sceneManager.loadGameOver(this.getResult());
  },
  fillBar(value) {
    this.barSprite.fillRange = value;
  },
  onDestroy() {
    this.node.off("tilesGroupDestroyed", this.handleScoreUp, this);
  },
});