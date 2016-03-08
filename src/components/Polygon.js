import {Entity} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

class Polygon extends React.Component {
  render() {
    const vertices = this.props.vertices.map(v => v.toAframeString()).join(' ');

    return (
      <Entity {...this.props} geometry={{primitive: 'polygon', vertices}}/>
    );
  }
}

export default Polygon;

