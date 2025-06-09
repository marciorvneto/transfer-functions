import { newMatrix, printMatrix, writeToDiagonal } from "./matrix";
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

const testTf = createTF([1], [1, 2, 3]);
const testODE = odeFromTF(testTf);
const matrices = getMatricesFromODE(testODE);

console.log(printTF(testTf));
console.log(printTF(multiplyTF(testTf, testTf)));

const { q, r } = polynomialDivision(createPoly([1, 2, 1]), createPoly([1, 1]));
console.log(q);
console.log(polyRepr(q));
console.log(polyRepr(r));
