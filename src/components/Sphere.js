import {Entity} from 'aframe-react';
import React from 'react';

export default props => {
  const {radius, color, src, position, rotation} = props;

  return (
    <Entity {...props} geometry={{primitive: 'sphere', radius: props.radius}}
            position={props.position}
    />
  );
};
