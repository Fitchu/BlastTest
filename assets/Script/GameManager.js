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
  },
  onLoad() {
    this.node.on("scoreUp", this.handleScorUp, this);
  },

  start() {
    this.barSprite.fillRange = 0;
    this._countMove = this.totalMove;
    this.moveLabel.string = this.totalMove;
  },
  onDestroy() {
    this.node.off(cc.Node.EventType.TOUCH_END);
  },
  handleScorUp(event) {
    event.stopPropagation();
    const score = event.getUserData();
    this._countScore += score.count * 10;
    this.fillBar(this._countScore / this.totalScrore);
    this.scoreLabel.string = this._countScore;
    this.moveLabel.string = --this._countMove;

    if (this._countScore >= this.totalScrore && this._countMove >= 0) {
      this.gameOver(this._countScore, this._countMove, true);
    } else if (this._countScore < this.totalScrore && this._countMove === 0) {
      this.gameOver(this._countScore, this._countMove, false);
    }
  },
  fillBar(value) {
    this.barSprite.fillRange = value;
  },
  gameOver(scores, moves, resultGame) {
    const event = new cc.Event.EventCustom("gameOver", true);
    event.setUserData({ scores, moves, resultGame });
    this.node.dispatchEvent(event);
  },
  onDestroy() {
    this.node.off("scoreUp", this.handleScorUp, this);
  },
});
