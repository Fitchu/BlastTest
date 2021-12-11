import Tile from "../../Tile";
import BombTilesGroupDeterminer from "../../Models/TilesGroupDeterminers/BombTilesGroupDeterminer";
import SuperTilesGroupDeterminer from "../../Models/TilesGroupDeterminers/SuperTilesGroupDeterminer";

const properties = {
  minTilesGroupLength: {
    default: 2,
    type: cc.Integer,
    displayName: "(K) Min. tiles in the group",
  },
  maxMixes: {
    default: 2,
    type: cc.Integer,
    displayName: "(S) Mixing tiles count",
  },
  explosionRadius: {
    default: 1,
    type: cc.Integer,
    displayName: "(R) Explosion radius",
  },
  tilesGroupLengthForSuperTile: {
    default: 7,
    type: cc.Integer,
    displayName:
      "(L) Min. length of destroyed tiles group for generation Super Tile",
  },
  explosionAmplificationBySuperTile: {
    default: 2,
    type: cc.Float,
  },
  _booster: {
    default: "",
  },
};

const methods = {
  setTiles: function (tiles) {
    this._tiles = tiles;
    this._bombTilesGroupDeterminer = new BombTilesGroupDeterminer(tiles);
    this._superTilesGroupDeterminer = new SuperTilesGroupDeterminer(
      this.explosionAmplificationBySuperTile,
      tiles
    );
  },
  setBooster: function (event, name) {
    this._booster = name;
  },
  onTileClick: function (event) {
    event.stopPropagation();
    const tile = event.target;
    if (this._booster === "teleport") {
      const tileComponent = tile.getComponent(Tile);
      const { position } = tileComponent;
      if (!this._source) {
        tileComponent.setActive(true);
        this._source = {
          position,
          tile,
        };
      } else {
        this._tiles.swap(this._source, { position, tile });
        this._booster = "";
        this._source.tile.getComponent(Tile).setActive(false);
        this._source = null;
      }
    } else {
      const { determiner, options, withSuperTile } =
        this.getDeterminerAndOptions(tile);
      this._tiles
        .useTilesGroupDeterminer(determiner)
        .determineTilesGroup(...options)
        .destroy()
        .generate(withSuperTile)
        .displace();
      this._booster = "";
    }
  },
  getDeterminerAndOptions(tile) {
    let determiner = null;
    const { position, isSuper } = tile.getComponent(Tile);
    const options = [position];
    const isExplosion = this._booster === "bomb";
    const withSuperTile = !(isSuper || isExplosion);

    if (!isSuper) {
      if (isExplosion) {
        determiner = this._bombTilesGroupDeterminer;
        options.push(this.explosionRadius);
      } else {
        options.push(tile.name);
      }
    } else {
      determiner = this._superTilesGroupDeterminer;
      options.push(this.explosionRadius, isExplosion);
    }

    return {
      determiner,
      options,
      withSuperTile,
    };
  },
  getTilesOptions: function () {
    return {
      minTilesGroupLength: this.minTilesGroupLength,
      maxMixes: this.maxMixes,
      tilesGroupLengthForSuperTile: this.tilesGroupLengthForSuperTile,
    };
  },
};

export const gameMechanicsProperties = properties;
export const gameMechanicsMethods = methods;
