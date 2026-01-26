import { filterMap } from "./util";

const EMPTY_ONE = 28;
const EMPTY_MANY = 29;
const WALL_ONE = 30;
const WALL_MANY = 31;

const encodeChr = (byte) => {
  if (byte < 65 || byte > 90) {
    throw new Error("found unexpected character in fill");
  }
  return byte - 65;
}

export const serializeGrid = ({grid, width}) => {
  return {
    fill: serializeFill({grid, width}),
    across: filterMap(grid, (elem) => elem.acrossClue),
    down: filterMap(grid, (elem) => elem.downClue),
  }
}

const serializeFill = ({grid, width}) => {
  let idx;

  // Closure over `&mut idx`.
  // I miss Rust.
  const compress = (one, many, pred) => {
    const start = idx;
    while (idx < grid.length && pred(grid[idx])) idx++;
    let len = idx - start;
    while (len > 0) {
      if (len == 1) {
        push5(one);
        break;
      } else if (len == 2) {
        push5(one);
        push5(one);
        break;
      } else {
        const take = Math.min(len, 258);
        len -= take;
        push5(many);
        push8(take-2);
      }
    }
  };

  const bytes = [0];
  let remBits = 8;

  const push = (byte, bits) => {
    const last = bytes.length - 1;
    if (bits <= remBits) { // if it fits
      remBits -= bits;
      const left = (byte << remBits) & 0xFF;
      bytes[last] |= left;
    } else { // if it's doesn't fits
      const left = (byte >> (bits - remBits)) & 0xFF;
      remBits += 8;
      remBits -= bits;
      const right = (byte << remBits) & 0xFF;
      bytes[last] |= left;
      bytes.push(right);
    }
  };
  const push5 = (byte) => push(byte, 5);
  const push8 = (byte) => push(byte, 8);

  // everything before this is setting up closure nonsense.
  // this begins the actual encoding algo.
  if (width > 256 || width == 0) {
    throw new Error("unsupported width")
  }
  push8(width-1);

  for (idx = 0; idx < grid.length; idx++) {
    if (grid[idx].wall) {
      compress(WALL_ONE, WALL_MANY, elem => elem.wall);
    } else if (grid[idx].fill === "") {
      compress(EMPTY_ONE, EMPTY_MANY, elem => elem.fill === "");
    } else {
      const fill = grid[idx].fill;
      const first = encodeChr(fill.charCodeAt(0));
      const second = fill.length === 1 ? EMPTY_ONE : encodeChr(fill.charCodeAt(1));
      push5(first);
      push5(second);
    }
  }
  return Uint8Array.from(bytes).toBase64({omitPadding: true});
}

const serialize = () => {
  // {
  //   meta: {title, author, notes},
  //   grid,
  //   down: [clue],
  //   across: [clue],
  // }
};
