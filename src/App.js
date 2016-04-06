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
import Text from './components/Text';
import Sky from './components/Sky';

import './util/stlExporter';
// saveSTL($('a-scene').object3D, 'dodeca')

const radius = 20;

export class App extends Component {
  constructor() {
    super();

    this.tick = this.tick.bind(this);

    this.state = {
      camera: {
        position: V3(),
      },
      currNote: 0,
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
    const v = 0.002 * dt;
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

    if(this.cursor.refine('leapMotion', 'isVR').value()) {

    }
    translate.z -= v;

    let camPos = this.cursor.refine('camera', 'position').value().clone();
    translate.applyQuaternion(this.camera.parent.quaternion);
    camPos.add(translate);

    this.cursor.refine('camera', 'position').set(camPos);
  }

  render() {
    const cursor = window.cursor = this.cursor = Cursor.build(this);
    const leapCur = cursor.refine('leapMotion');
    const timeCur = this.timeCur = cursor.refine('time');

    const camPos = this.cursor.refine('camera', 'position').value();

    return (
      <Scene onEnterVR={() => {leapCur.refine('isVR').set(true);}}
             onExitVR={() => {leapCur.refine('isVR').set(false);}}
             onTick={(t, dt) => this.tick(t, dt)}
             fog={{type: 'exponential', density: Math.pow(radius, -1.05), color: '#fff'}}
      >
        <Entity position={camPos.toAframeString()}>
          <Camera onLoaded={(evt) => {this.camera = evt.target.sceneEl.camera;}}>
            <LeapMotion cursor={leapCur} time={timeCur}/>
          </Camera>
        </Entity>

        <DodecahedronController radius={radius}
                                cameraPosCur={cursor.refine('camera', 'position')}
                                currNoteCur={cursor.refine('currNote')}
        />

        <Text look-at="[camera]"
              scale="3 3 3"
              text={{text: _.padStart(cursor.refine('currNote').value(), 2, '0')}} />


      </Scene>
    );
  }
}