import {
  gameMechanicsProperties,
  gameMechanicsMethods,
} from "./Composables/useGameMechanics";
import {
  UIComponentsProperties,
  UIComponentsMethods,
} from "./Composables/useUIComponents";

cc.Class({
  name: "GameManager",
  extends: cc.Component,

  properties: () => {
    const gameMechanics = gameMechanicsProperties;
    const uiComponents = UIComponentsProperties;
    return {
      ...gameMechanics,
      ...uiComponents,
      _sceneManager: {
        type: cc.Node,
        default: null,
      },
    };
  },

  ...gameMechanicsMethods,
  ...UIComponentsMethods,

  onLoad() {
    this.node.on("maxMixesReached", this.handleMaxMixesReached, this);
    this.node.on("tilesGroupDestroyed", this.handleScoreUp, this);
    this._sceneManager = cc.find("SceneManager").getComponent("SceneManager");
  },

  start() {
    this.onUIComponentsStart();
  },

  handleScoreUp(event) {
    event.stopPropagation();
    const score = event.getUserData();
    this.scoreUp(score);
    if (this._scoreCount < this.totalScore && this._stepsCount >= 0) return;
    this._sceneManager.loadGameOver(this.getResult());
  },

  handleMaxMixesReached() {
    this._sceneManager.loadGameOver(this.getResult());
  },

  onDestroy() {
    this.node.off("tilesGroupDestroyed", this.handleScoreUp, this);
  },
});
