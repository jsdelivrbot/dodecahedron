import React from 'react';
import ReactDOM from 'react-dom';
import {Entity} from 'aframe-react';
import Sphere from './Sphere';
import Polygon from './Polygon';
import Text from './Text';
import _ from 'lodash';
/*

 P(± a, ± a, ± a)

 P(0, ± b, ± c)

 P(± b, ± c, 0)

 P(± c, 0, ± b)
 */
const phi = (1 + Math.sqrt(5)) / 2;
const sqrt3 = Math.sqrt(3);

const getVertices = r => {
  const a = r / sqrt3;
  const b = r / (sqrt3 * phi);
  const c = (r * phi) / sqrt3;

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

const acc = [
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
  (acc, val) => val.add(acc),
  V3(0, 0, 0)
).divideScalar(vecs.length);


class Dodecahedron extends React.Component {
  render() {
    const vertices = getVertices(1.2 * this.props.radius);

    const pentagons = acc.map(verts => {
      const pentVerts = verts.map(i => vertices[i]);
      return {
        pentVerts,
        center: averageVecs(pentVerts.map(vert => arrToV3(vert)))
      };

    });

    return (
      <Entity ref={(cmp)=> {
        const el = ReactDOM.findDOMNode(cmp);
        if(!el) return;
        const obj = el.object3D;
        obj.rotateOnAxis(pentagons[8].center.normalize(), 0.05);
      }}>
        {pentagons.map(p => <Polygon vertices={p.pentVerts} />)}
        {pentagons.map((p, i) => <Entity look-at="[camera]" position={`${p.center.x * 0.8} ${p.center.y * 0.8} ${p.center.z * 0.8}`}>
          <Text text={{text: i, size: 0.2}}  />
        </Entity> )}
        {getVertices(this.props.radius).map((v, i) =>
          <Sphere radius={0.1}
                  onMouseEnter={()=>{
                    /*if(acc[acc.length - 1].length === 5) {
                      acc.push([]);
                    }

                    let arr = acc[acc.length - 1];
                    arr.push(i);
                    console.log(JSON.stringify(acc));*/
                  }}
                  key={i}
                  position={V3(v[0], v[1], v[2]).toAframeString()}
                  look-at="[camera]"
          >
            <Text text={{text: i, size: 0.2}} />
          </Sphere>
        )}
      </Entity>
    );
  }
}

export default Dodecahedron;