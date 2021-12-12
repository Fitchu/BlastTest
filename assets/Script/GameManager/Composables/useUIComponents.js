const properties = {
  totalSteps: {
    type: cc.Integer,
    default: 0,
  },
  totalScore: {
    type: cc.Integer,
    default: 0,
  },
  _stepsCount: {
    type: cc.Integer,
    default: 0,
    serializable: false,
  },
  _scoreCount: {
    type: cc.Integer,
    default: 0,
    serializable: false,
  },
  stepsLabel: {
    type: cc.Label,
    default: null,
  },
  scoreLabel: {
    type: cc.Label,
    default: null,
  },
  progressBarSprite: {
    type: cc.Sprite,
    default: null,
  },
};

const methods = {
  onUIComponentsStart: function () {
    this.progressBarSprite.fillRange = 0;
    this.stepsLabel.string = this.totalSteps;
    this._stepsCount = this.totalSteps;
  },
  getResult: function () {
    return `${
      this._scoreCount >= this.totalScore ? "Победа" : "Поражение"
    }. Ваш счет: ${this._scoreCount}`;
  },
  fillBar: function (value) {
    cc.tween(this.progressBarSprite).to(0.3, { fillRange: value }).start();
  },
  scoreUp: function (score) {
    this._scoreCount += score.count * 10;
    this.fillBar(this._scoreCount / this.totalScore);
    this.scoreLabel.string = this._scoreCount;
    this.stepsLabel.string = --this._stepsCount;
  },
};

export const UIComponentsProperties = properties;
export const UIComponentsMethods = methods;
