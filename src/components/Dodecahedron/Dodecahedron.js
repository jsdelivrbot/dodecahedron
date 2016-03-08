import React from 'react';
import {Entity} from 'aframe-react';
import Polygon from '../Polygon';
import {hslToHex} from '../../util/colorConversion';

import {getPentagons} from './DodecahedronGeometry';

class Dodecahedron extends React.Component {
  render() {
    const pentagons = getPentagons(this.props.radius);

    const rotateConstantly = (cmp)=> {
      /*const el = ReactDOM.findDOMNode(cmp);
       if(!el) return;
       const obj = el.object3D;
       if(!isNaN(this.props.pentIndex)) {
       obj.rotateOnAxis(pentagons[this.props.pentIndex].center.normalize(), 0.05);
       }*/
    };



    return (
      <Entity ref={rotateConstantly} {...this.props}>
        {pentagons.map((p, i) =>
          <Polygon key={i}
                   vertices={p.vertices}
                   material={{transparent: true, opacity: 1, color: hslToHex(i / 12, 1, 0.5)}}/>
        )}

      </Entity>
    );
  }
}

export default Dodecahedron;