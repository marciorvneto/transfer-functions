type Matrix = {
  rows: number;
  cols: number;
  array: number[][];
};

export const newMatrix = (m: number, n: number, value = 0): Matrix => {
  const array = new Array<number>(m)
    .fill(0)
    .map((_) => new Array<number>(n).fill(value));
  return { rows: m, cols: n, array };
};

export const printMatrix = (m: Matrix) => {
  const maxWidth = Math.max(...m.array.flat().map((val) => String(val).length));

  console.log("[");
  for (let i = 0; i < m.rows; i++) {
    const row = m.array[i]
      .map((val) => String(val).padStart(maxWidth, " "))
      .join("  ");
    console.log(`  ${row}`);
  }
  console.log("]");
};

export const writeToDiagonal = (m: Matrix, value: number, diag = 0) => {
  const inBounds = (i: number, j: number) => {
    if (i < m.rows && j < m.cols) return true;
    return false;
  };
  if (diag > m.cols || diag > m.rows) {
    throw new Error(`Diagonal exceeds matrix dimensions`);
  }
  let i = 0;
  while (true) {
    const j = i + diag;
    if (!inBounds(i, j)) return;
    m.array[i][i + diag] = value;
    i++;
  }
};
