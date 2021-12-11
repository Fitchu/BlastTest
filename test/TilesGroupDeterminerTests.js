import TilesGroupDeterminer from "../assets/Script/Models/TilesGroupDeterminers/TilesGroupDeterminer";
import Position from "../assets/Script/Models/Position";
import { expect } from "chai";

const tiles1 = {
  tiles: [
    [{ name: 1 }, { name: 1 }, { name: 4 }],
    [{ name: 1 }, { name: 2 }, { name: 3 }],
    [{ name: 1 }, { name: 3 }, { name: 4 }],
  ],
};
const tiles2 = {
  tiles: [
    [{ name: 1 }, { name: 3 }, { name: 4 }, { name: 1 }],
    [{ name: 2 }, { name: 1 }, { name: 1 }, { name: 4 }],
    [{ name: 3 }, { name: 1 }, { name: 1 }, { name: 2 }],
    [{ name: 1 }, { name: 3 }, { name: 3 }, { name: 1 }],
  ],
};
const clickedTilePosition1 = new Position(0, 0);
const clickedTilePosition2 = new Position(1, 1);

const clickedTileColor = 1;

const answer1 = [
  new Position(0, 0),
  new Position(1, 0),
  new Position(2, 0),
  new Position(0, 1),
];

const toLeftUp = new Position(3, 0);
const toLeftBottom = new Position(0, 0);
const toRightUp = new Position(3, 3);
const toRightBottom = new Position(0, 3);

describe("TilesGroupDeterminer", function () {
  describe("#determineTilesGroup()", function () {
    it("Находит правильную группу", function () {
      const _determiner = new TilesGroupDeterminer(tiles1);
      const _tilesGroup = _determiner.determineTilesGroup(
        clickedTilePosition1,
        clickedTileColor
      );

      expect(_tilesGroup).to.have.deep.members(answer1);
    });
    describe("Не добавляет тайл в группу с тем же цветом по диагонали:", function () {
      const _determiner = new TilesGroupDeterminer(tiles2);
      const _tilesGroup = _determiner.determineTilesGroup(
        clickedTilePosition2,
        clickedTileColor
      );

      it("Налево вверх", function () {
        expect(_tilesGroup).to.not.deep.include(toLeftUp);
      });
      it("Направо вверх", function () {
        expect(_tilesGroup).to.not.deep.include(toRightUp);
      });
      it("Направо вниз", function () {
        expect(_tilesGroup).to.not.deep.include(toRightBottom);
      });
      it("Налево вниз", function () {
        expect(_tilesGroup).to.not.deep.include(toLeftBottom);
      });
    });
  });
});
