import BombTilesGroupDeterminer from "../assets/Script/Models/TilesGroupDeterminers/BombTilesGroupDeterminer";
import Position from "../assets/Script/Models/Position";
import { expect } from "chai";

const _tiles = {
  tiles: [
    [{ name: 1 }, { name: 3 }, { name: 4 }, { name: 4 }, { name: 4 }],
    [{ name: 2 }, { name: 2 }, { name: 3 }, { name: 2 }, { name: 4 }],
    [{ name: 4 }, { name: 4 }, { name: 4 }, { name: 1 }, { name: 4 }],
    [{ name: 3 }, { name: 2 }, { name: 1 }, { name: 3 }, { name: 4 }],
    [{ name: 1 }, { name: 3 }, { name: 4 }, { name: 2 }, { name: 4 }],
    [{ name: 1 }, { name: 1 }, { name: 2 }, { name: 3 }, { name: 4 }],
    [{ name: 1 }, { name: 1 }, { name: 2 }, { name: 3 }, { name: 4 }],
    [{ name: 1 }, { name: 1 }, { name: 2 }, { name: 3 }, { name: 4 }],
  ],
};
const explosionRadius = 1;

describe("BombTilesGroupDeterminer", function () {
  describe("#determineTilesGroup()", function () {
    const clickedTilePosition = new Position(3, 2);
    const _determiner = new BombTilesGroupDeterminer(_tiles);
    // const _tilesGroup = _determiner.determineTilesGroup(
    //   clickedTilePosition,
    //   explosionRadius
    // );
    console.log(_determiner);

    // it("Взрыв тайла в центре массива в радиусе 1", function () {
    //   expect(_tilesGroup).to.not.deep.include(toLeftUp);
    // });
  });
});
