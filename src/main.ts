interface Poly {
  coeffs: number[],
  degree: number
}

interface TF {
  num: Poly,
  den: Poly
}

interface ODE {
  outputs: Poly,
  inputs: Poly,
}

interface ODESystem {
  odes: ODE[]
}

const addPoly = (p1: Poly, p2: Poly): Poly => {
  const deg = Math.max(p1.degree, p2.degree);
  const coeffs = (new Array(deg + 1)).fill(0).map((_, idx) => {
    let p1c = 0;
    let p2c = 0;
    if (idx < p1.degree + 1) {
      p1c = p1.coeffs[idx];
    }
    if (idx < p2.degree + 1) {
      p2c = p2.coeffs[idx];
    }
    return p1c + p2c;
  });
  return createPoly(coeffs);
}

const multPolyConstant = (p: Poly, k: number): Poly => {
  return createPoly(p.coeffs.map(c => k * c));
}

const multPoly = (p1: Poly, p2: Poly): Poly => {
  const deg = p1.degree + p2.degree;
  const coeffs = (new Array(deg + 1)).fill(0);
  for (let i = 0; i <= p1.degree; i++) {
    for (let j = 0; j <= p2.degree; j++) {
      coeffs[i + j] += p1.coeffs[i] * p2.coeffs[j];
    }
  }
  const poly = createPoly(coeffs);
  return poly;
}

const createPoly = (coeffs: number[]): Poly => {
  const n = coeffs.length - 1;
  return {
    degree: n,
    coeffs: [...coeffs]
  }
}

const createTF = (numCoeffs: number[], denCoeffs: number[]): TF => {
  return {
    num: createPoly(numCoeffs),
    den: createPoly(denCoeffs)
  }
}

const multiplyTF = (tf1: TF, tf2: TF): TF => {
  return {
    num: multPoly(tf1.num, tf2.num),
    den: multPoly(tf1.den, tf2.den),
  }
}

const odeFromTF = (tf: TF): ODE => {
  return {
    outputs: tf.den,
    inputs: tf.num
  }
}

const createODESystem = (odes: ODE[]): ODESystem => {
  return {
    odes: [...odes.map(ode => {
      return ode
    })]
  }
}

const printPoly = (poly: Poly, varName = "s") => {
  let monomials: string[] = [];
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
  })
  return monomials.join(" + ")
}

const printTF = (tf: TF) => {
  const numStr = printPoly(tf.num);
  const denStr = printPoly(tf.den);
  const maxLen = Math.max(numStr.length, denStr.length);
  const divider = "-".repeat(maxLen);
  const numPadding = Math.round((maxLen - numStr.length) / 2);
  const denPadding = Math.round((maxLen - denStr.length) / 2);
  return `${" ".repeat(numPadding)}${numStr}\n${divider}\n${"".repeat(denPadding)}${denStr}`
}

const testTf = createTF([1], [1, 2, 3])
const testODE = odeFromTF(testTf);

console.log(addPoly(createPoly([1, 2]), createPoly([2, 3, 0, 4])))
console.log(multPoly(createPoly([1, 2]), createPoly([2, 3, 0, 4])))


console.log(printTF(testTf))
console.log(printTF(multiplyTF(testTf, testTf)))
