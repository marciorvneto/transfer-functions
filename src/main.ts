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

const createPoly = (coeffs: number[]): Poly => {
  const n = coeffs.length + 1;
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

const printPoly = (poly: Poly) => {
  let monomials: string[] = [];
  poly.coeffs.forEach((coeff, deg) => {
    if (coeff !== 0) {
      if (deg === 0) {
        monomials.push(`${coeff}`);
        return;
      }
      if (deg === 1) {
        monomials.push(`${coeff}x`);
        return;
      }
      monomials.push(`${coeff}x^${deg}`);
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



console.log(printTF(testTf))
