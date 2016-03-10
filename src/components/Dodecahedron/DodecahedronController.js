import React, {PropTypes} from 'react';
import {ImmutableOptimizations} from 'react-cursor';
import {Entity} from 'aframe-react';
import Dodecahedron from './Dodecahedron';
import Polygon from '../Polygon';

import {getPentagons} from './DodecahedronGeometry';
import {hslToHex} from '../../util/colorConversion';
import _ from 'lodash';

const _shouldComponentUpdate = ImmutableOptimizations().shouldComponentUpdate;

class DodecahedronController extends React.Component {
  static propTypes = {
    radius: PropTypes.number.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return _shouldComponentUpdate.call(this, nextProps);
  }

  render() {
    const {radius} = this.props;
    const pentagons = getPentagons(radius);
    const pentCenters = _.map(pentagons, 'center');

    const onLoadDod = (axis, evt) => {
      const obj = evt.target.object3D;
      obj.rotateOnAxis(axis, Math.PI);
    };

    const innerDodecahedron = pentagons.map((p, pentIndex) => _(p.vertices)
      .map((vertex, i, vertices) => [vertex, vertices[(i + 1) % vertices.length]])
      .map((pair, polyIndex) => {
        const center = pentagons[pentIndex].center;

        const aperture = 0.6; //Math.sin(pentIndex + timeCur.value().t / 1000) * 0.4 + 0.6

        const vertices = pair
          .concat(V3().copy(pair[1]).lerp(center, aperture))
          .concat(V3().copy(pair[0]).lerp(center, aperture));

        return (
          <Polygon key={`${pentIndex}${polyIndex}`}
                   vertices={vertices}
                   material={{color: hslToHex(pentIndex / 12, 1, 0.1)}}/>
        );

      }).value());

    return (
      <Entity>
        {pentCenters.map((vec, i) =>
          <Dodecahedron radius={radius}
                        onLoaded={_.partial(onLoadDod, V3().copy(vec).normalize())}
                        position={vec.multiplyScalar(2.01).toAframeString()}/>
        )}

        {innerDodecahedron}
      </Entity>
    );
  }
}

export default DodecahedronController;