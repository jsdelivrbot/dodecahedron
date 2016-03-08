import _ from 'lodash';

const phi = (1 + Math.sqrt(5)) / 2;
const sqrt3 = Math.sqrt(3);

const getVertices = r => {
  const a = r / sqrt3;
  const b = r / (sqrt3 * phi);
  const c = (r * phi) / sqrt3;

  /*
   P(± a, ± a, ± a)
   P(0, ± b, ± c)
   P(± b, ± c, 0)
   P(± c, 0, ± b)
   */

  return [
    [ a,  a,  a],
    [-a,  a,  a],
    [ a, -a,  a],
    [ a,  a, -a],
    [-a, -a,  a],
    [ a, -a, -a],
    [-a,  a, -a],
    [-a, -a, -a],
    [ 0,  b,  c],
    [ 0, -b,  c],
    [ 0,  b, -c],
    [ 0, -b, -c],
    [ b,  c,  0],
    [-b,  c,  0],
    [ b, -c,  0],
    [-b, -c,  0],
    [ c,  0,  b],
    [ c,  0, -b],
    [-c,  0,  b],
    [-c,  0, -b],
  ];
};

const pentagons = [
  [0,8,1,13,12],
  [0,12,3,17,16],
  [0,16,2,9,8],
  [1,8,9,4,18],
  [1,18,19,6,13],
  [3,12,13,6,10],
  [2,14,15,4,9],
  [2,16,17,5,14],
  [3,10,11,5,17],
  [4,15,7,19,18],
  [5,11,7,15,14],
  [6,19,7,11,10]
];

const averageVecs = vecs => _.reduce(
  vecs,
  (acc, val) => acc.add(val),
  V3(0, 0, 0)
).divideScalar(vecs.length);

export const getPentagons = radius => {
  const verts = getVertices(radius);
  return _.map(pentagons, pentagon => {
    const vertices = pentagon.map(vertIndex => arrToV3(verts[vertIndex]));
    return {
      vertices,
      center: averageVecs(vertices),
    }
  })
};