import React, { Component } from 'react';
import 'aframe';
import './util/shorthand';

import {Scene, Entity} from 'aframe-react';
import Camera from './components/Camera';
import Dodecahedron from './components/Dodecahedron/Dodecahedron';
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
    };
  }

  render() {
    const cursor = Cursor.build(this);
    const leapCur = cursor.refine('leapMotion');

    const radius = 1;

    const pentCenters = _.map(getPentagons(radius), 'center');

    const onLoadDod = (axis, evt) => {
      const obj = evt.target.object3D;
      obj.rotateOnAxis(axis, Math.PI);
    };

    return (
      <Scene onEnterVR={() => {leapCur.refine('isVR').set(true);}}
             onExitVR={() => {leapCur.refine('isVR').set(false);}}
             onTick={()=>{this.forceUpdate()}}
      >
        <Camera>
          <LeapMotion cursor={leapCur}/>
        </Camera>


        {pentCenters.map((vec, i) =>
          <Dodecahedron radius={radius}
                        onLoaded={_.partial(onLoadDod, V3().copy(vec).normalize())}
                        position={vec.multiplyScalar(2.0).toAframeString()}/>
        )}

      </Scene>
    );
  }
}