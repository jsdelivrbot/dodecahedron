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

const radius = 20;

export class App extends Component {
  constructor() {
    super();

    this.tick = this.tick.bind(this);

    this.state = {
      camera: {
        position: V3(),
      },
      keys: {
        87: false,
        83: false,
        65: false,
        68: false,
      },
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

  componentDidMount() {
    window.addEventListener('keydown', evt => this.cursor.refine('keys', evt.keyCode).set(true));
    window.addEventListener('keyup', evt => this.cursor.refine('keys', evt.keyCode).set(false));
  }

  tick(t, dt) {
    this.timeCur.set({t, dt});

    const translate = V3(); //TODO: use camera forward vector
    const keys = this.state.keys;
    const v = 0.1;
    if(keys[87]) {
      translate.z -= v
    }
    if(keys[83]) {
      translate.z += v
    }
    if(keys[65]) {
      translate.x -= v
    }
    if(keys[68]) {
      translate.x += v
    }

    let camPos = V3().copy(this.cursor.refine('camera', 'position').value());
    camPos.add(translate);
    if(camPos.length() > radius * 0.9) { //TODO: plane intersection with pentagons
      camPos.multiplyScalar(-0.9);
      // TODO: find closest pentagon center when crossing through, rotate PentagonController 180 on that axis
    }


    this.cursor.refine('camera', 'position').set(camPos);
  }

  render() {
    const cursor = this.cursor = Cursor.build(this);
    const leapCur = cursor.refine('leapMotion');
    const timeCur = this.timeCur = cursor.refine('time');

    const camPos = this.cursor.refine('camera', 'position').value();

    return (
      <Scene onEnterVR={() => {leapCur.refine('isVR').set(true);}}
             onExitVR={() => {leapCur.refine('isVR').set(false);}}
             onTick={(t, dt) => this.tick(t, dt)}
             fog={{type: 'exponential', density: Math.pow(radius, -1.1), color: '#fff'}}
      >
        <Entity position={camPos.toAframeString()}>
          <Camera onLoaded={(evt) => {this.camera = evt.target.sceneEl.camera;}}>
            <LeapMotion cursor={leapCur} time={timeCur}/>
          </Camera>
        </Entity>

        <DodecahedronController radius={radius} />
      </Scene>
    );
  }
}