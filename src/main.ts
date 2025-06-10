import { addVec, cloneVector, Matrix, matVecMult, multVec, newMatrix, printMatrix, Vector, writeToDiagonal } from "./matrix";
import {
  createPoly,
  isZeroPoly,
  multPoly,
  Poly,
  polynomialDivision,
} from "./poly";

interface TF {
  num: Poly;
  den: Poly;
}

interface ODE {
  outputs: Poly;
  inputs: Poly;
}

interface ODESystem {
  odes: ODE[];
}

const createTF = (numCoeffs: number[], denCoeffs: number[]): TF => {
  return {
    num: createPoly(numCoeffs),
    den: createPoly(denCoeffs),
  };
};

const multiplyTF = (tf1: TF, tf2: TF): TF => {
  return {
    num: multPoly(tf1.num, tf2.num),
    den: multPoly(tf1.den, tf2.den),
  };
};

const odeFromTF = (tf: TF): ODE => {
  return {
    outputs: tf.den,
    inputs: tf.num,
  };
};

const getStateSpaceRealizationMatrices = (tf: TF) => {
  const n = tf.den.coeffs.length - 1; // Output
  const A = newMatrix(n, n);
  writeToDiagonal(A, 1, 1);
  for (let j = 0; j < n; j++) {
    A.array[n - 1][j] =
      -tf.den.coeffs[j] / tf.den.coeffs[n];
  }

  const B = newMatrix(n, 1, 0);
  B.array[n - 1][0] = 1 / tf.den.coeffs[n];

  const C = newMatrix(1, n, 0);
  for (let j = 0; j < n; j++) {
    C.array[0][j] = tf.num.coeffs[j];
  }

  const D = newMatrix(1, 1, 0);

  return { A, B, C, D };

};


const getMatricesFromODE = (ode: ODE) => {
  const nOutCoeffs = ode.outputs.coeffs.length;
  const nInCoeffs = ode.inputs.coeffs.length;
  const A = newMatrix(nOutCoeffs - 1, nOutCoeffs - 1);
  writeToDiagonal(A, 1, 1);
  for (let j = 0; j < nOutCoeffs - 1; j++) {
    A.array[nOutCoeffs - 2][j] =
      -ode.outputs.coeffs[j] / ode.outputs.coeffs[nOutCoeffs - 1];
  }

  const B = newMatrix(nOutCoeffs - 1, nInCoeffs);
  // B.array[nOutCoeffs - 2][nInCoeffs - 1] =
  //   -ode.inputs.coeffs[j] / ode.outputs.coeffs[nOutCoeffs - 1];
  // console.log({ nOutCoeffs, nInCoeffs });

  printMatrix(A);
  printMatrix(B);
};

const createODESystem = (odes: ODE[]): ODESystem => {
  return {
    odes: [
      ...odes.map((ode) => {
        return ode;
      }),
    ],
  };
};

const polyRepr = (poly: Poly, varName = "s") => {
  let monomials: string[] = [];
  if (isZeroPoly(poly)) {
    return "0";
  }
  poly.coeffs.forEach((coeff, deg) => {
    if (coeff !== 0) {
      if (deg === 0) {
        monomials.push(`${coeff}`);
        return;
      }
      if (deg === 1) {
        monomials.push(`${coeff}${varName}`);
        return;
      }
      monomials.push(`${coeff}${varName}^${deg}`);
    }
  });
  return monomials.join(" + ");
};

const simulateRK45 = (A: Matrix, B: Matrix, C: Matrix, D: Matrix, x0: Vector, ut: (t: number) => Vector, maxTime: number, n: number) => {

  const steps: Vector[] = [];
  let x = cloneVector(x0);
  const dt = maxTime / (n - 1);
  for (let t = 0; t <= maxTime; t += dt) {
    const u = ut(t);
    const dx = multVec(addVec(matVecMult(A, x), matVecMult(B, u)), dt);
    x = addVec(x, dx);
    steps.push(x);
  }

  return steps;

}

const printTF = (tf: TF) => {
  const numStr = polyRepr(tf.num);
  const denStr = polyRepr(tf.den);
  const maxLen = Math.max(numStr.length, denStr.length);
  const divider = "-".repeat(maxLen);
  const numPadding = Math.round((maxLen - numStr.length) / 2);
  const denPadding = Math.round((maxLen - denStr.length) / 2);
  return `${" ".repeat(numPadding)}${numStr}\n${divider}\n${"".repeat(
    denPadding,
  )}${denStr}`;
};

const testTf = createTF([1, 0], [1, 1]);
// const testTf2 = createTF([10 / 9, 4 / 9], [1, -2, 3]);
// console.log(testTf2)
console.log(testTf);
const { A, B, C, D } = getStateSpaceRealizationMatrices(testTf);
console.log({ A: A.array, B: B.array, C: C.array })

const res = simulateRK45(A, B, C, D, { array: [2], n: 1 }, (t: number) => {
  return { array: [1], n: 1 };
}, 10, 100);

console.log(res.map(v => v.array[0]).join("\n"))

