export type Matrix = {
  rows: number;
  cols: number;
  array: number[][];
};

export type Vector = {
  array: number[];
  n: number;
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

export const newVector = (n: number, value = 0): Vector => {
  const array = new Array<number>(n).fill(value)
  return {
    array,
    n
  }
}

export const cloneVector = (v: Vector): Vector => {
  return {
    array: [...v.array],
    n: v.n
  };
}

export const matVecMult = (M: Matrix, v: Vector) => {
  if (M.cols !== v.n) {
    throw new Error(`Mismatching dimensions: ${M.cols} x ${v.n}`);
  }
  const out = newVector(v.n);
  for (let i = 0; i < M.rows; i++) {
    let acum = 0;
    for (let j = 0; j < M.cols; j++) {
      acum += M.array[i][j] * v.array[j];
    }
    out.array[i] = acum;
  }
  return out;
}
export const addVec = (v1: Vector, v2: Vector): Vector => {
  return {
    array: v1.array.map((v, idx) => v + v2.array[idx]),
    n: v1.n
  }
}
export const multVec = (v: Vector, lambda: number): Vector => {
  return {
    array: v.array.map((v, idx) => v * lambda),
    n: v.n
  }
}
