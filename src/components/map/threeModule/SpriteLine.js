/*
 * @Author: JackFly
 * @since: 2020-09-21 16:49:51
 * @lastTime: 2020-09-29 10:48:22
 * @FilePath: /TrunkOS-3D/src/components/threeModule/SpriteLine.js
 * @message:动线模块
 */
import * as maptalks from "maptalks";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";

import { BaseObject } from "maptalks.three";

var OPTIONS = {
  altitude: 0,
  speed: 0.01,
};

class SpriteLine extends BaseObject {
  constructor(lineString, options, material, layer) {
    super();
    options.offset = material.uniforms.offset.value;
    options.clock = new THREE.Clock();
    //geoutil.js getLinePosition
    const { positions } = getLinePosition(lineString, layer);
    const positions1 = _getLinePosition(lineString, layer).positions;

    options = maptalks.Util.extend({}, OPTIONS, options, {
      layer,
      lineString,
      positions: positions1,
    });
    this._initOptions(options);

    const geometry = new THREE.Geometry();
    for (let i = 0; i < positions.length; i += 3) {
      geometry.vertices.push(
        new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
      );
    }
    const meshLine = new MeshLine();
    meshLine.setGeometry(geometry);

    const map = layer.getMap();
    const size = map.getSize();
    const width = size.width;
    const height = size.height;
    material.uniforms.resolution.value.set(width, height);

    const line = new THREE.Mesh(meshLine.geometry, material);
    this._createGroup();
    this.getObject3d().add(line);
    const { altitude } = options;
    const z = layer.distanceToVector3(altitude, altitude).x;
    const center = lineString.getCenter();
    const v = layer.coordinateToVector3(center, z);
    this.getObject3d().position.copy(v);
  }
  _animation() {
    this.options.offset.x -= this.options.speed * this.options.clock.getDelta();
  }
}

function getLinePosition(lineString, layer, cenerter) {
  const positions = [];
  const positionsV = [];
  if (Array.isArray(lineString) && lineString[0] instanceof THREE.Vector3) {
    for (let i = 0, len = lineString.length; i < len; i++) {
      const v = lineString[i];
      positions.push(v.x, v.y, v.z);
      positionsV.push(v);
    }
  } else {
    if (Array.isArray(lineString))
      lineString = new maptalks.LineString(lineString);
    if (!lineString || !(lineString instanceof maptalks.LineString)) return;
    const z = 0;
    const coordinates = lineString.getCoordinates();
    const centerPt = layer.coordinateToVector3(
      cenerter || lineString.getCenter()
    );
    for (let i = 0, len = coordinates.length; i < len; i++) {
      let coordinate = coordinates[i];
      if (Array.isArray(coordinate)) {
        coordinate = new maptalks.Coordinate(coordinate);
      }
      const v = layer.coordinateToVector3(coordinate, z).sub(centerPt);
      positions.push(v.x, v.y, v.z);
      positionsV.push(v);
    }
  }
  return {
    positions: positions,
    positionsV: positionsV,
  };
}

function _getLinePosition(lineString, layer) {
  const positions = [];
  const positionsV = [];
  if (Array.isArray(lineString) && lineString[0] instanceof THREE.Vector3) {
    for (let i = 0, len = lineString.length; i < len; i++) {
      const v = lineString[i];
      positions.push(v.x, v.y, v.z);
      positionsV.push(v);
    }
  } else {
    if (Array.isArray(lineString))
      lineString = new maptalks.LineString(lineString);
    if (!lineString || !(lineString instanceof maptalks.LineString)) return;
    const z = 0;
    const coordinates = lineString.getCoordinates();
    for (let i = 0, len = coordinates.length; i < len; i++) {
      let coordinate = coordinates[i];
      if (Array.isArray(coordinate))
        coordinate = new maptalks.Coordinate(coordinate);
      const v = layer.coordinateToVector3(coordinate, z);
      positions.push(v.x, v.y, v.z);
      positionsV.push(v);
    }
  }
  return {
    positions: positions,
    positionsV: positionsV,
  };
}

export default SpriteLine;
