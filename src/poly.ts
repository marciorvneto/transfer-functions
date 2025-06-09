const TOL = 1e-12;

export interface Poly {
  coeffs: number[];
  degree: number;
}

const cleanUp = (p: Poly): Poly => {
  if (p.coeffs.length === 0) {
    return createPoly([0]);
  }
  let i = p.coeffs.length - 1;
  while (p.coeffs[i] === 0 && i > 0) {
    i--;
  }
  if (i === p.coeffs.length - 1) return p;
  const newCoeffs = p.coeffs.slice(0, i + 1);
  return {
    coeffs: newCoeffs,
    degree: newCoeffs.length - 1,
  };
};

export const addPoly = (p1: Poly, p2: Poly): Poly => {
  const deg = Math.max(p1.degree, p2.degree);
  const coeffs = new Array(deg + 1).fill(0).map((_, idx) => {
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
  return cleanUp(createPoly(coeffs));
};

export const subPoly = (p1: Poly, p2: Poly): Poly => {
  return cleanUp(addPoly(p1, multPolyConstant(p2, -1)));
};

export const multPolyConstant = (p: Poly, k: number): Poly => {
  return createPoly(p.coeffs.map((c) => k * c));
};

export const multPoly = (p1: Poly, p2: Poly): Poly => {
  const deg = p1.degree + p2.degree;
  const coeffs = new Array(deg + 1).fill(0);
  for (let i = 0; i <= p1.degree; i++) {
    for (let j = 0; j <= p2.degree; j++) {
      coeffs[i + j] += p1.coeffs[i] * p2.coeffs[j];
    }
  }
  const poly = createPoly(coeffs);
  return poly;
};

export const createPoly = (coeffs: number[]): Poly => {
  const n = coeffs.length - 1;
  return cleanUp({
    degree: n,
    coeffs: [...coeffs],
  });
};

export const isZeroPoly = (p: Poly) => {
  for (let coeff of p.coeffs) {
    if (Math.abs(coeff) > TOL) return false;
  }
  return true;
};

export const clonePoly = (p: Poly): Poly => {
  return {
    degree: p.degree,
    coeffs: p.coeffs,
  };
};

const multiplyByXn = (p: Poly, n: number): Poly => {
  return {
    degree: p.degree + n,
    coeffs: [...new Array(n).fill(0), ...p.coeffs],
  };
};

const getLeadingCoeff = (p: Poly) => {
  return p.coeffs[p.coeffs.length - 1];
};

/**
 * P(x) = Q(x) * D(x) + R(x)
 *
 */
export const polynomialDivision = (p: Poly, d: Poly) => {
  if (isZeroPoly(d)) throw new Error("Cannot divide by the zero polynomial.");

  if (d.degree > p.degree) {
    return {
      q: createPoly([0]),
      r: createPoly(p.coeffs),
    };
  }

  let q = createPoly([0]);
  let r = clonePoly(p);

  while (r.degree >= d.degree) {
    const newDegree = r.degree - d.degree;
    const newLeadingCoeff = getLeadingCoeff(r) / getLeadingCoeff(d);
    const newMonomial = multiplyByXn(createPoly([newLeadingCoeff]), newDegree);
    const toSub = multPoly(d, newMonomial);
    r = subPoly(r, toSub);
    q = addPoly(q, newMonomial);
    if (isZeroPoly(r)) {
      return { q, r };
    }
  }

  return { q, r };
};
