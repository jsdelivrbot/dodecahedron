import React, {PropTypes} from 'react';
import {ImmutableOptimizations} from 'react-cursor';
import {Entity} from 'aframe-react';
import DodecahedronFrame from './DodecahedronFrame';
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

    return (
      <Entity>
        {pentCenters.map((vec, i) =>
          <DodecahedronFrame radius={radius}
                             pentagons={pentagons}
                             key={i}
                             onLoaded={_.partial(onLoadDod, V3().copy(vec).normalize())}
                             position={V3().copy(vec).multiplyScalar(2.01).toAframeString()}/>
        )}

        <DodecahedronFrame radius={radius}
                           pentagons={pentagons}
        />
      </Entity>
    );
  }
}

export default DodecahedronController;