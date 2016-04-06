import React from 'react';
import {Entity} from 'aframe-react';
import Polygon from '../Polygon';
import {hslToHex} from '../../util/colorConversion';
import _ from 'lodash';

class DodecahedronFrame extends React.Component {
  render() {
    const {pentagons} = this.props;

    const dodecahedron = pentagons.map((p, pentIndex) => _(p.vertices)
      .map((vertex, i, vertices) => [vertex, vertices[(i + 1) % vertices.length]])
      .map((pair, polyIndex) => {
        const center = pentagons[pentIndex].center;

        const aperture = 0.5;

        const vertices = pair
          .concat(pair[1].clone().lerp(center, 1 - aperture))
          .concat(pair[0].clone().lerp(center, 1 - aperture));

        return (
          <Polygon key={`${pentIndex}${polyIndex}`}
                   vertices={vertices}
                   material={{color: hslToHex(pentIndex / 12, 1, 0.1)}}/>
        );

      }).value());

    return (
      <Entity {...this.props}>
        {dodecahedron}
      </Entity>
    );
  }
}

export default DodecahedronFrame;