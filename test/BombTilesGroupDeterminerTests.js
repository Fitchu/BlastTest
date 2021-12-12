import BombTilesGroupDeterminer from "../assets/Script/Models/TilesGroupDeterminers/BombTilesGroupDeterminer";
import Position from "../assets/Script/Models/Position";
import { expect } from "chai";
import { assert } from "chai";

const tiles = {
  rows: 5,
  columns: 8,
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
const determiner = new BombTilesGroupDeterminer(tiles);

describe("BombTilesGroupDeterminer", function () {
  describe("#determineTilesGroup()", function () {
    it("Взрыв тайла в центре массива с радиусом 1", function () {
      const clickedTilePosition = new Position(3, 2);
      const tilesGroup = determiner.determineTilesGroup(
        clickedTilePosition,
        explosionRadius
      );
      determiner.clear();
      const answer = [
        { column: 2, row: 1 },
        { column: 2, row: 2 },
        { column: 2, row: 3 },
        { column: 3, row: 1 },
        { column: 3, row: 2 },
        { column: 3, row: 3 },
        { column: 4, row: 1 },
        { column: 4, row: 2 },
        { column: 4, row: 3 },
      ];
      expect(tilesGroup).to.have.deep.members(answer);
    });
    describe("Взрыв с радиусом 1 в разных углах", function () {
      const errorMessage =
        "Ожидается, что длина тайл группы при взрыве в углу равна \
        (1 + радиус взрыва) ^ 2 и координаты тайлов в тайлс группе \
        не отличаются более чем на радиус взрыва.";
      const checkFunc = function (tileGroup, clickedTilePosition) {
        return (
          !tileGroup.some((tile) => {
            const { column, row } = clickedTilePosition;
            if (
              tile.column - column > explosionRadius ||
              tile.row - row > explosionRadius
            )
              return true;
          }) && tileGroup.length === Math.pow(explosionRadius + 1, 2)
        );
      };

      const checkPositions = [
        {
          message: "Взрыв тайла в нижнем левом углу",
          position: new Position(0, 0),
        },
        {
          message: "Взрыв тайла в верхнем левом углу",
          position: new Position(tiles.columns - 1, 0),
        },
        {
          message: "Взрыв тайла в нижнем правом углу",
          position: new Position(0, tiles.rows - 1),
        },
        {
          message: "Взрыв тайла в верхнем правом углу",
          position: new Position(tiles.columns - 1, tiles.rows - 1),
        },
      ];

      checkPositions.forEach((checkPosition) => {
        const { message, position } = checkPosition;
        it(message, function () {
          const tilesGroup = determiner.determineTilesGroup(
            position,
            explosionRadius
          );
          determiner.clear();
          assert(checkFunc(tilesGroup, position), errorMessage);
        });
      });
    });
  });
});
