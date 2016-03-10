import React, { Component } from 'react';
import {Cursor} from 'react-cursor';
import 'aframe';
import './util/shorthand';
import {hslToHex} from './util/colorConversion';
import _ from 'lodash';

import {Scene, Entity} from 'aframe-react';
import Camera from './components/Camera';
import DodecahedronController from './components/Dodecahedron/DodecahedronController';
import LeapMotion from './components/LeapMotion';
import Polygon from './components/Polygon';
import Sky from './components/Sky';


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

    return (
      <Scene onEnterVR={() => {leapCur.refine('isVR').set(true);}}
             onExitVR={() => {leapCur.refine('isVR').set(false);}}
             onTick={(t, dt)=>{timeCur.set({t, dt})}}
             fog={{type: 'exponential', density: Math.pow(radius, -1.1), color: '#fff'}}
      >
        <Camera>
          <LeapMotion cursor={leapCur} time={timeCur}/>
        </Camera>
        <DodecahedronController radius={radius} />
      </Scene>
    );
  }
}