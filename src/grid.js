export const renumberSubgrid = ({grid, width, height}) => {
  let num = 1;
  const setNum = ({idx, topBounded, leftBounded}) => {
    const cell = grid[idx];
    const bounded = topBounded || leftBounded;
    cell.number = null;
    if (topBounded) cell.downClue ??= "";
    else cell.downClue = null;
    if (leftBounded) cell.acrossClue ??= "";
    else cell.acrossClue = null;
    if (!cell.wall && bounded) {
      cell.number = num;
      num++;
    }
  };

  const isWall = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return true;
    const idx = y * width + x;
    return grid[idx].wall;
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      // one cell regions do NOT get clues.
      const topBounded = isWall(x, y-1) && !isWall(x, y+1);
      const leftBounded = isWall(x-1, y) && !isWall(x+1, y);
      setNum({idx, topBounded, leftBounded});
    }
  }
}
