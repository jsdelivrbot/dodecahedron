import {Entity} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

class Polygon extends React.Component {
  render() {
    // expects array(vertices) of arrays(coordinates)
    const vertices = this.props.vertices.map(v => v.join(' ')).join(' ');

    return (
      <Entity {...this.props} geometry={{primitive: 'polygon', vertices}}/>
    );
  }
}

export default Polygon;

