import {Entity} from 'aframe-react';
import React, {PropTypes} from 'react';
import LeapMotionHand from './LeapMotionHand';

import 'leapjs-plugins';
import Leap from 'leapjs';

import {Cursor, ImmutableOptimizations} from 'react-cursor';

// Here we ignore cursor changes (Leap Motion updates between frames) and only update/re-render
// when time changes, which means that a tick() happened.
const _shouldComponentUpdate = ImmutableOptimizations(['time'], ['cursor']).shouldComponentUpdate;

import _ from 'lodash';

class LeapMotion extends React.Component {
  static propTypes = {
    cursor: PropTypes.instanceOf(Cursor),
    time: PropTypes.instanceOf(Cursor),
  };

  shouldComponentUpdate(nextProps) {
    return _shouldComponentUpdate.call(this, nextProps);
  }

  componentDidMount() {
    const cursor = this.props.cursor;

    Leap.loop({
        background: true,
        host: window.location.hostname,
      // to allow connection to another computer on the network:
      // disable firewall on port 6437
      // set websockets_allow_remote in leap service config:
      // https://developer.leapmotion.com/documentation/cpp/devguide/Leap_Configuration.html#websocket-options

      }, (frame) => {
        _.each(frame.hands, hand => cursor.refine(hand.type).set({
          confidence: hand.confidence,
          fingers: hand.fingers.map(finger => arrToV3(finger.tipPosition).divideScalar(1000)),
          palm: arrToV3(hand.palmPosition).divideScalar(1000),
          pitchYawRoll: V3(hand.pitch(), -hand.yaw(), hand.roll()).multiplyScalar(180 / Math.PI),
          pinchStrength: hand.pinchStrength,
          grabStrength: hand.grabStrength,
        }));
      })
      .use('handEntry')
      .on('handFound', (hand) => {
      })
      .on('handLost', (hand) => {
        cursor.refine(hand.type, 'confidence').set(0);
      });
  }

  render() {
    const {isVR, left, right} = this.props.cursor.value();
    return (
      <Entity rotation={isVR ? "90 0 180" : "0 0 0"}
              position={isVR ? "0 0 0" : "0 -0.2 -0.7"}>
        <LeapMotionHand hand={left}/>
        <LeapMotionHand hand={right}/>
      </Entity>
    );
  }
}

export default LeapMotion;
