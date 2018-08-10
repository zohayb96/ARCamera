import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  PanResponder,
  Animated,
} from 'react-native';
import Expo from 'expo';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import { Button } from 'react-native-elements';
import { ColorWheel } from 'react-native-color-wheel';
require('./AssimpLoader');
require('./OBJLoader');
var convert = require('color-convert');
var hsl = require('hsl-to-hex');

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY(),
      color: null,
      hexColor: '',
    };
    this.model = null;
    this.graffitiObjects = [];
    this.addCube = this.addCube.bind(this);
    this.findColor = this.findColor.bind(this);
  }

  // componentWillMount() {
  //   this._val = { x: 0, y: 0 };
  //   this.state.pan.addListener(value => (this._val = value));

  //   this.panResponder = PanResponder.create({
  //     onStartShouldSetPanResponder: (e, gesture) => true,
  //     onPanResponderGrant: (e, gesture) => {
  //       this.state.pan.setOffset({
  //         x: this._val.x,
  //         y: this._val.y,
  //       });
  //       this.state.pan.setValue({ x: 0, y: 0 });
  //     },
  //     onPanResponderMove: Animated.event([
  //       null,
  //       { dx: this.state.pan.x, dy: this.state.pan.y },
  //     ]),
  //   });
  // }

  // handleDrop = () => {
  //   console.log('PRessed');
  //   const geometry = new THREE.BoxGeometry(0.07, 0.07, 0.07);
  //   const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  //   const thingToDrop = new THREE.Mesh(geometry, customMaterial);
  //   const newItem = dropItem(thingToDrop, this.camera.position);
  //   this.scene.add(newItem);
  // };

  findColor() {
    const colorHex = hsl(
      Math.round(this.state.color.h),
      Math.round(this.state.color.s),
      Math.round(this.state.color.v / 2)
    );
    console.log(colorHex);
    this.setState({ colorHex: colorHex });
    return colorHex;
  }

  async addCube() {
    const colorToUse = this.findColor();
    console.log(colorToUse);
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial({ color: colorToUse });
    const mesh = new THREE.Mesh(geometry, material);
    // console.log(this.state);
    const newItem = setModelPos(mesh, this.camera.position);
    this.graffitiObjects.push(newItem);
    this.scene.add(newItem);

    // TRIANGLES
    // var triangles = 5000;
    // var geometry = new THREE.BufferGeometry();
    // var positions = new Float32Array(triangles * 3 * 3);
    // var normals = new Float32Array(triangles * 3 * 3);
    // var colors = new Float32Array(triangles * 3 * 3);
    // var color = new THREE.Color();
    // var n = 800,
    //   n2 = n / 2; // triangles spread in the cube
    // var d = 10,
    //   d2 = d / 2; // individual triangle size
    // var pA = new THREE.Vector3();
    // var pB = new THREE.Vector3();
    // var pC = new THREE.Vector3();
    // var cb = new THREE.Vector3();
    // var ab = new THREE.Vector3();
    // for (var i = 0; i < positions.length; i += 9) {
    //   // positions
    //   var x = Math.random() * n - n2;
    //   var y = Math.random() * n - n2;
    //   var z = Math.random() * n - n2;
    //   var ax = x + Math.random() * d - d2;
    //   var ay = y + Math.random() * d - d2;
    //   var az = z + Math.random() * d - d2;
    //   var bx = x + Math.random() * d - d2;
    //   var by = y + Math.random() * d - d2;
    //   var bz = z + Math.random() * d - d2;
    //   var cx = x + Math.random() * d - d2;
    //   var cy = y + Math.random() * d - d2;
    //   var cz = z + Math.random() * d - d2;
    //   positions[i] = ax;
    //   positions[i + 1] = ay;
    //   positions[i + 2] = az;
    //   positions[i + 3] = bx;
    //   positions[i + 4] = by;
    //   positions[i + 5] = bz;
    //   positions[i + 6] = cx;
    //   positions[i + 7] = cy;
    //   positions[i + 8] = cz;
    //   // flat face normals
    //   pA.set(ax, ay, az);
    //   pB.set(bx, by, bz);
    //   pC.set(cx, cy, cz);
    //   cb.subVectors(pC, pB);
    //   ab.subVectors(pA, pB);
    //   cb.cross(ab);
    //   cb.normalize();
    //   var nx = cb.x;
    //   var ny = cb.y;
    //   var nz = cb.z;
    //   normals[i] = nx;
    //   normals[i + 1] = ny;
    //   normals[i + 2] = nz;
    //   normals[i + 3] = nx;
    //   normals[i + 4] = ny;
    //   normals[i + 5] = nz;
    //   normals[i + 6] = nx;
    //   normals[i + 7] = ny;
    //   normals[i + 8] = nz;
    //   // colors
    //   var vx = x / n + 0.5;
    //   var vy = y / n + 0.5;
    //   var vz = z / n + 0.5;
    //   color.setRGB(vx, vy, vz);
    //   colors[i] = color.r;
    //   colors[i + 1] = color.g;
    //   colors[i + 2] = color.b;
    //   colors[i + 3] = color.r;
    //   colors[i + 4] = color.g;
    //   colors[i + 5] = color.b;
    //   colors[i + 6] = color.r;
    //   colors[i + 7] = color.g;
    //   colors[i + 8] = color.b;
    // }
    // geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    // geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    // geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    // geometry.computeBoundingSphere();
    // var material = new THREE.MeshPhongMaterial({
    //   color: 0xaaaaaa,
    //   specular: 0xffffff,
    //   shininess: 250,
    //   side: THREE.DoubleSide,
    //   vertexColors: THREE.VertexColors,
    // });
    // mesh = new THREE.Mesh(geometry, material);
    // const newItem = setModelPos(mesh, this.camera.position);
    // this.scene.add(newItem);
    // END OF TRIANGLES
  }

  render() {
    // const panStyle = {
    //   transform: this.state.pan.getTranslateTransform(),
    // };
    return (
      <View style={{ flex: 1 }}>
        <Expo.GLView
          ref={ref => (this._glView = ref)}
          style={{ flex: 1 }}
          onContextCreate={this._onGLContextCreate}
        />
        <View style={styles.colorPicker}>
          <ColorWheel
            onColorChange={color => this.setState({ color })}
            style={{
              height: 100,
              width: 100,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
        <View style={styles.drop}>
          <Button
            raised
            rounded
            title="Draw"
            onPress={this.addCube}
            buttonStyle={{
              backgroundColor: 'red',
              opacity: 0.2,
              width: 85,
              height: 85,
            }}
          />
          <Image style={styles.can} source={require('./sprayCan.png')} />
        </View>
      </View>
    );
  }

  _onGLContextCreate = async gl => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    this.arSession = await this._glView.startARSessionAsync();

    this.scene = new THREE.Scene();
    this.camera = ExpoTHREE.createARCamera(
      this.arSession,
      width,
      height,
      0.01,
      1000
    );
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const customMaterial = new THREE.MeshBasicMaterial({
      map: await ExpoTHREE.createTextureAsync({
        asset: Expo.Asset.fromModule(require('./uv.jpg')),
      }),
      transparent: true,
    });

    const glassMaterial = new THREE.MeshBasicMaterial({
      map: await ExpoTHREE.createTextureAsync({
        asset: Expo.Asset.fromModule(require('./Glass.jpg')),
      }),
      transparent: true,
      opacity: 0.75,
    });

    this.scene.background = ExpoTHREE.createARBackgroundTexture(
      this.arSession,
      renderer
    );
    var SphereGeometry = new THREE.SphereGeometry(0.8, 0.07, 0.07);

    // Edit the box dimensions here and see changes immediately!
    var geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, customMaterial);
    var cube1 = new THREE.Mesh(geometry, customMaterial);
    cube.position.z = -0.8;
    cube1.position.z = -1.0;
    this.model = await loadModel(this.state.color);
    // scene.add(cube);
    // scene.add(cube1);
    var sphere = new THREE.Mesh(geometry, glassMaterial);
    sphere.position.z = 0.8;
    // scene.add(sphere);
    // this.camera.position.z = 5;
    // particleSystem = new THREE.GPUParticleSystem({
    //   maxParticles: 250000,
    // });
    // scene.add(particleSystem);

    // lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    // var lineGeometry = new THREE.Geometry();
    // lineGeometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    // lineGeometry.vertices.push(new THREE.Vector3(0, 10, 0));
    // lineGeometry.vertices.push(new THREE.Vector3(10, 0, 0));
    // var line = new THREE.Line(lineGeometry, lineMaterial);
    // scene.add(line);

    // const sphereGeometry = new THREE.SphereBufferGeometry(1, 36, 36);
    // const sphere = new THREE.Mesh(sphereGeometry, glassMaterial);
    // scene.add(sphere);
    // sphere.position.z = -2;

    /// Triangle cube

    const animate = () => {
      requestAnimationFrame(animate);
      this.camera.position.setFromMatrixPosition(this.camera.matrixWorld);
      const cameraPos = new THREE.Vector3(0, 0, 0);
      cameraPos.applyMatrix4(this.camera.matrixWorld);

      this.graffitiObjects.forEach(art => {
        // Animates items for live movement
        art.rotation.x += art.rotator;
        art.rotation.y += art.rotator;
      });

      cube.rotation.x += 0.02;
      cube.rotation.y += 0.02;

      renderer.render(this.scene, this.camera);
      gl.endFrameEXP();
    };
    animate();
  };
}

// async function loadModel() {
//   // Load the banana model
//   const modelAsset = Asset.fromModule(require('./flamingo'));
//   await modelAsset.downloadAsync();

//   const flamingoMaterial = new THREE.MeshPhongMaterial({
//     color: '#FFFF00',
//     specular: 0x555555,
//     shininess: 100,
//   });
//   const loader = new THREE.OBJLoader();

//   return new Promise(function executor(resolve) {
//     loader.load(modelAsset.localUri, function(object) {
//       //Adds color to banana but will need lighting to see it
//       //See generateLighting function
//       object.traverse(function(child) {
//         if (child instanceof THREE.Mesh) {
//           child.material = bananaMaterial;
//         }
//       });
//       resolve(object);
//     });
//   });
// }

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height - 250,
    left: width / 2 - 200,
  },
  colorPicker: {
    position: 'absolute',
    top: height - 620,
    left: width / 2 - 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 17,
    left: 10,
  },
  items: {
    position: 'absolute',
    top: 60,
    left: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    marginRight: 5,
  },
  can: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

async function loadModel(hexcolor) {
  const geometry = new THREE.BoxGeometry(0.07, 0.07, 0.07);
  var material = new THREE.MeshBasicMaterial({ color: '#FFFFFFF' });
  const sphere = new THREE.SphereGeometry(0.1, 0.07, 0.07);
  const customMaterial = new THREE.MeshBasicMaterial({
    map: await ExpoTHREE.createTextureAsync({
      asset: Expo.Asset.fromModule(require('./uv.jpg')),
    }),
    transparent: true,
    opacity: 0.75,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function setModelPos(model, dropPos) {
  const item = model.clone();
  item.position.x = dropPos.x;
  item.position.y = dropPos.y;
  item.position.z = dropPos.z;
  item.rotator = 0.02;
  return item;
}
