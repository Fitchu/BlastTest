class Position {
  constructor(column, row) {
    this.column = Number(column);
    this.row = Number(row);
  }

  static isEqual(position1, position2) {
    return (
      position1.column === position2.column && position1.row === position2.row
    );
  }
}
export default Position;
