/*
 * @Author: yunfei
 * @since: 2020-09-21 16:49:51
 * @lastTime: 2020-10-21 08:44:04
 * @FilePath: /TrunkAdmin/src/components/map/threeModule/Radar.js
 * @message:雷达模块
 */
import * as maptalks from "maptalks";
import * as THREE from "three";

import { BaseObject } from "maptalks.three";

//default values
var OPTIONS = {
  radius: 1000,
  altitude: 10,
};
var num = 0;
var flag = true;
/**
 * custom Circle component
 *
 * you can customize your own components
 * */

class Radar extends BaseObject {
  constructor(coordinate, options, material, layer) {
    options = maptalks.Util.extend({}, OPTIONS, options, {
      layer,
      coordinate,
    });
    super();
    //Initialize internal configuration
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
    this._initOptions(options);
    const { altitude, radius } = options;
    //generate geometry
    const r = layer.distanceToVector3(radius, radius).x;
    const geometry = new THREE.CircleBufferGeometry(r, 100);

    //Initialize internal object3d
    // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L140
    this._createMesh(geometry, material);

    //set object3d position
    const z = layer.distanceToVector3(altitude, altitude).x;
    const position = layer.coordinateToVector3(coordinate, z);
    this.getObject3d().position.copy(position);
    // console.log(options);
    this._scale = 1;
    // this.getObject3d().rotation.x = -Math.PI;

    this.getObject3d().name = "radar";
  }

  // test animation
  _animation() {
    this._scale = this._scale >= 1 ? 0.1 : this._scale;
    this._scale += 0.01;
    this.getObject3d().scale.set(this._scale, this._scale, this._scale);

    num += 0.01;
    this.getObject3d().rotation.z = num;
  }
}

export default Radar;
