// // import { get } from "lodash";

// // var TilesGroup = cc.Class({
// //   properties: () => ({
// //     tiles: [[]],
// //     tilesGroupToDisplace: {
// //       get: function () {
// //         return this._tilesGroupToDisplace;
// //       },
// //     },
// //     tilesGroupToGenerate: {
// //       get: function () {
// //         return this._tilesGroupToGenerate;
// //       },
// //     },
// //     parent: {
// //       get: function () {
// //         return this._parent;
// //       },
// //     },
// //   }),
// //   ctor: function (parent) {
// //     this._parent = parent;
// //   },
// //   findTilesGroup(x, y, color) {},
// //   tryToDestroyTilesGroup(x, y, color) {},
// //   displaceTilesGroup(parent) {},
// //   generateNewTiles(parent) {},
// // });
// // module.exports = TilesGroup;

// import { get } from "lodash";

// class TilesGroup {
//   tiles = [[]];
//   minLength = 0;
//   constructor() {
//     if (arguments.length === 4) {
//       //НАДО ПОМЕНЯТь
//       const areaWidth = arguments[0];
//       const areaHeight = arguments[1];
//       this.minLength = arguments[2];
//       const getTile = arguments[3];
//       for (let x = 0; x < areaWidth; x++) {
//         for (let y = 0; y < areaHeight; y++) {
//           this.tiles[x][y] = getTile();
//         }
//       }
//     } else if (arguments.length === 1) {
//       this.parent = arguments[0];
//     }
//   }
//   hasTilesGroup() {
//     return false;
//   }
//   tryToDestroyTilesGroup(x, y, color) {
//     this.tilesToDisplace = new TilesGroup(this);
//     this.tilesToGenerate = new TilesGroup(this);
//     const countTilesToGenerate = [];
//     const tilesToDestroy = new TilesGroup();
//     this.tryToDestroyTilesGroup(
//       x,
//       y,
//       color,
//       countTilesToGenerate,
//       tilesToDestroy
//     );
//     //СДЕЛАТЬ УДАЛЕНИЕ ТАЙЛОВ
//     return this;
//   }

//   tryToDestroyTilesGroup(x, y, color, countTilesToGenerate, tilesToDestroy) {
//     if (get(tilesToDestroy.tiles, "[x][y]") || this.tiles[x][y].name !== color)
//       return;
//     //gathering tiles to destroy
//     tilesToDestroy.tiles[x][y] = this.tiles[x][y];

//     const count = get(this.tilesToDisplace.tiles, "[x][y].count");
//     if (count) count = null;
//     //counting tiles amount to generate by column
//     const column = countTilesToGenerate[x];
//     if (column) {
//       column.count++;
//       this.tilesToGenerate.tiles[x][this.tiles.length - column.count] =
//         getTile(true);
//     } else {
//       countTilesToGenerate[x] = { count: 1 };
//       this.tilesToGenerate.tiles[x][this.tiles.length - 1] = getTile(true);
//     }
//     //counting on how much positions we need to displace certain tiles
//     for (let i = y + 1; i < this.tiles.length; i++) {
//       const displaceTileCount = get(this.tilesToDisplace.tiles, "[x][i].count");
//       if (get(tilesToDestroy.tiles, "[x][i]")) {
//         if (displaceTileCount) delete this.tilesToDisplace.tiles[x][i];
//         continue;
//       }
//       if (displaceTileCount) {
//         displaceTileCount++;
//       } else {
//         this.tilesToDisplace.tiles[x][i] = { count: 1 };
//       }
//     }
//     //call this func recursively
//     const points = [
//       { x: x + 1, y },
//       { x: x - 1, y },
//       { x, y: y + 1 },
//       { x, y: y - 1 },
//     ];
//     points.forEach((point) => {
//       this.tryToDestroyTilesGroup(
//         point.x,
//         point.y,
//         color,
//         countTilesToGenerate,
//         tilesToDestroy
//       );
//     });
//   }

//   displaceTilesGroup(parent) {}
//   generateNewTiles(parent) {}
//   getTilesToDisplace() {
//     return this.tilesToDisplace;
//   }
//   getTilesToGenerate() {
//     return this.tilesToGenerate;
//   }
// }

// module.exports = TilesGroup;
class TilesGroup extends Array {
  constructor(tiles) {
    super();
    this.tiles = tiles;
    this.minYByX = {};
  }

  push(value) {
    if (!this.minYByX[value.x] && this.minYByX[value.x] !== 0) {
      this.minYByX[value.x] = value.y;
    } else if (this.minYByX[value.x] > value.y) {
      this.minYByX[value.x] = value.y;
    }
    super.push(value);
  }
}
module.exports = TilesGroup;
