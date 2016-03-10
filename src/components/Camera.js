import {Entity} from 'aframe-react';
import React from 'react';

export default props => <Entity camera="near:0.1" wasd-controls={{fly: true}} look-controls {...props} >
  {props.children}
</Entity>;
