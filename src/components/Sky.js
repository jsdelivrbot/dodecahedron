import {Entity} from 'aframe-react';
import React from 'react';

export default props =>
    <Entity geometry={{primitive: 'sphere', radius: 5000}}
            material={{color: "#fff", shader: 'flat'}}
            scale="1 1 -1"/>;
