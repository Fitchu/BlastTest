import SuperTilesGroupDeterminer from "../assets/Script/Models/TilesGroupDeterminers/SuperTilesGroupDeterminer";
import { expect } from "chai";
import { assert } from "chai";

const tiles = {
  rows: 5,
  columns: 5,
  tiles: [
    [{ name: 1 }, { name: 3 }, { name: 4 }, { name: 4 }, { name: 4 }],
    [{ name: 2 }, { name: 2 }, { name: 3 }, { name: 2 }, { name: 4 }],
    [{ name: 4 }, { name: 4 }, { name: 4 }, { name: 1 }, { name: 4 }],
    [{ name: 3 }, { name: 2 }, { name: 1 }, { name: 3 }, { name: 4 }],
    [{ name: 1 }, { name: 3 }, { name: 4 }, { name: 2 }, { name: 4 }],
  ],
};
const explosionAmplificationBySuperTile = 2;
const determiner = new SuperTilesGroupDeterminer(
  explosionAmplificationBySuperTile,
  tiles
);
describe("SuperTilesGroupDeterminer", function () {
  describe("#determineTilesGroupByColumn()", function () {
    it("Правильное определение группы по колонке", function () {
      const clickedIndexColumn = 3;
      const answer = [];
      for (let i = 0; i < tiles.rows; i++) {
        answer.push({
          row: i,
          column: clickedIndexColumn,
        });
      }

      const tilesGroup =
        determiner.determineTilesGroupByColumn(clickedIndexColumn);
      determiner.clear();
      expect(tilesGroup).to.have.deep.members(answer);
    });
  });
  describe("#determineTilesGroupByRow()", function () {
    it("Правильное определение группы тайлов по строке", function () {
      const clickedIndexRow = 3;
      const answer = [];
      for (let i = 0; i < tiles.columns; i++) {
        answer.push({
          row: clickedIndexRow,
          column: i,
        });
      }

      const tilesGroup = determiner.determineTilesGroupByRow(clickedIndexRow);
      determiner.clear();
      expect(tilesGroup).to.have.deep.members(answer);
    });
  });
  describe("#determineTilesGroupByArea()", function () {
    it("Правильное определение группы по области", function () {
      const answer = [];
      for (let i = 0; i < tiles.columns; i++) {
        for (let j = 0; j < tiles.rows; j++) {
          answer.push({
            row: j,
            column: i,
          });
        }
      }

      const tilesGroup = determiner.determineTilesGroupByArea();
      determiner.clear();
      expect(tilesGroup).to.have.deep.members(answer);
    });
  });
});
