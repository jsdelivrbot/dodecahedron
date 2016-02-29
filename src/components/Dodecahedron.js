import React from 'react';
import {Entity} from 'aframe-react';
import Sphere from './Sphere'
import Polygon from './Polygon'
import Text from './Text'

/*

 P(± a, ± a, ± a)

 P(0, ± b, ± c)

 P(± b, ± c, 0)

 P(± c, 0, ± b)
 */
const phi = (1 + Math.sqrt(5)) / 2;
const sqrt3 = Math.sqrt(3);

const vertices = r => {
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
  [1,18,19,6,13]
];

class Dodecahedron extends React.Component {
  render() {
    const pentagons = acc.map(verts => verts.map(i => vertices(1.2 * this.props.radius)[i]));

    return (
      <Entity>
        {pentagons.map(p => <Polygon vertices={p} />)}
        {vertices(this.props.radius).map((v, i) =>
          <Sphere radius={0.1}
                  onMouseEnter={()=>{
                    if(acc[acc.length - 1].length === 5) {
                      acc.push([]);
                    }

                    let arr = acc[acc.length - 1];
                    arr.push(i);
                    console.log(JSON.stringify(acc));
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