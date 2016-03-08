import React, { Component } from 'react';
import 'aframe';
import './util/shorthand';
import {hslToHex} from './util/colorConversion';

import _ from 'lodash';

import {Scene, Entity} from 'aframe-react';
import Camera from './components/Camera';
import Dodecahedron from './components/Dodecahedron/Dodecahedron';
import Polygon from './components/Polygon';
import Sky from './components/Sky';
import LeapMotion from './components/LeapMotion';

import {getPentagons} from './components/Dodecahedron/DodecahedronGeometry';

import {Cursor} from 'react-cursor';

export class App extends Component {
  constructor() {
    super();

    this.state = {
      leapMotion: {
        isVR: false,
        left: {
          confidence: 0,
          fingers: [],
          palm: V3(),
          pitchYawRoll: V3(),
          grabStrength: 0,
          pinchStrength: 0,
        },
        right: {
          confidence: 0,
          fingers: [],
          palm: V3(),
          pitchYawRoll: V3(),
          grabStrength: 0,
          pinchStrength: 0,
        },
      },
      time: {
        t: 0,
        dt: 0,
      }
    };
  }

  render() {
    const cursor = Cursor.build(this);
    const leapCur = cursor.refine('leapMotion');
    const timeCur = cursor.refine('time');

    const radius = 20;

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
      <Scene onEnterVR={() => {leapCur.refine('isVR').set(true);}}
             onExitVR={() => {leapCur.refine('isVR').set(false);}}
             onTick={(t, dt)=>{/*timeCur.set({t, dt})*/}}
             fog={{type: 'exponential', density: Math.pow(radius, -1.1), color: '#fff'}}
      >
        <Camera>
          <LeapMotion cursor={leapCur}/>
        </Camera>

        {pentCenters.map((vec, i) =>
          <Dodecahedron radius={radius}
                        onLoaded={_.partial(onLoadDod, V3().copy(vec).normalize())}
                        position={vec.multiplyScalar(2.01).toAframeString()}/>
        )}

        {innerDodecahedron}

      </Scene>
    );
  }
}