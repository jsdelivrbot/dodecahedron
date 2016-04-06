import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ImmutableOptimizations} from 'react-cursor';
import {Entity} from 'aframe-react';
import DodecahedronFrame from './DodecahedronFrame';
import Polygon from '../Polygon';
import Sphere from '../Sphere';

import {getPentagons} from './DodecahedronGeometry';
import {hslToHex} from '../../util/colorConversion';
import _ from 'lodash';

class DodecahedronView extends React.Component {
  constructor() {
    super();
    this.shouldComponentUpdate = ImmutableOptimizations().shouldComponentUpdate.bind(this);
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
          <Sphere key={i}
                  radius={0.2}
                  color={hslToHex(i/ 12, 1, 0.1)}
                  onLoaded={_.partial(this.props.onLoadPentCenter, i)}
                  position={vec.toAframeString()}/>
        )}

        {pentCenters.map((vec, i) =>
          <DodecahedronFrame radius={radius}
                             pentagons={pentagons}
                             key={i}
                             onLoaded={_.partial(onLoadDod, vec.clone().normalize())}
                             position={V3().copy(vec).multiplyScalar(2.01).toAframeString()}/>
        )}

        <DodecahedronFrame radius={radius}
                           pentagons={pentagons}
        />


      </Entity>
    );
  }
}


class DodecahedronController extends React.Component {
  constructor() {
    super();
    this.portals = {};
    this.generatePortal = this.generatePortal.bind(this);
    this.onLoadPentCenter = this.onLoadPentCenter.bind(this);

    this.shouldComponentUpdate = ImmutableOptimizations(['cameraPosCur']).shouldComponentUpdate.bind(this);
  }

  componentDidUpdate() {
    const camPos = this.props.cameraPosCur.value().clone();

    let collisionOnThisTick = false;
    _.each(this.portals, (p, i) => {
      if(p.plane.distanceToPoint(camPos) < 0.1) {
        if(!this.hasCollided) {
          console.log('collision with ', i);

          // fake torroidal geometry
          camPos.multiplyScalar(-1);
          this.props.cameraPosCur.set(camPos);

          // rotate the whole dodecahedral assembly on the axis we just collided with
          const dod = ReactDOM.findDOMNode(this.refs.dodecahedron).object3D;
          const axis = dod.worldToLocal(p.plane.normal.clone());
          dod.rotateOnAxis(axis, Math.PI);

          // update our portals. defer so the scene has a chance to update world matrix
          _.defer(() => {
            _.each(this.portals, (p, i) => {
              this.generatePortal(i, p.obj);
            });
          })

        }

        this.hasCollided = collisionOnThisTick = true;
      }
    });
    this.hasCollided = collisionOnThisTick;
  }

  generatePortal(i, obj) {

    const vec = obj.getWorldPosition();
    const vecLength = vec.length();
    const normal = vec.normalize();

    this.portals[i] = {
      obj,
      plane: new THREE.Plane(normal, vecLength)
    };
  }

  onLoadPentCenter(i, evt) {
    this.generatePortal(i, evt.target.object3D);
  }

  render() {
    return (
      <DodecahedronView ref="dodecahedron" radius={this.props.radius} onLoadPentCenter={this.onLoadPentCenter} />
    );
  }
}

export default DodecahedronController;