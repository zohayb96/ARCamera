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
import { AR } from 'expo';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import { Button } from 'react-native-elements';
import { ColorWheel } from 'react-native-color-wheel';
require('./AssimpLoader');
require('./OBJLoader');
var convert = require('color-convert');
var hsl = require('hsl-to-hex');
import Icon from 'react-native-vector-icons/FontAwesome';

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
    this.addSphere = this.addSphere.bind(this);
    this.addTriangle = this.addTriangle.bind(this);
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
    const glassMaterial = new THREE.MeshBasicMaterial({
      map: await ExpoTHREE.createTextureAsync({
        asset: Expo.Asset.fromModule(require('./Glass.jpg')),
      }),
      transparent: true,
      opacity: 0.75,
    });
    const colorToUse = this.findColor();
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial({
      color: colorToUse,
      transparent: true,
      opacity: 0.75,
    });
    const mesh = new THREE.Mesh(geometry, material);
    const newItem = setModelPos(mesh, this.camera.position);
    newItem.castShadow = true;
    this.graffitiObjects.push(newItem);
    this.scene.add(newItem);
  }

  async addTriangle() {
    const colorToUse = this.findColor();
    var material = new THREE.MeshBasicMaterial({
      color: colorToUse,
      opacity: 0.75,
      transparent: true,
    });
    const mesh = new THREE.Mesh(
      new THREE.TetrahedronBufferGeometry(0.1, 0),
      material
    );
    const newItem = setModelPos(mesh, this.camera.position);
    this.graffitiObjects.push(newItem);
    this.scene.add(newItem);
  }

  async addSphere() {
    const colorToUse = this.findColor();
    console.log(colorToUse);
    const sphereGeometry = new THREE.SphereGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial({
      color: colorToUse,
      opacity: 0.75,
      transparent: true,
    });
    const mesh = new THREE.Mesh(sphereGeometry, material);
    // console.log(this.state);
    const newItem = setModelPos(mesh, this.camera.position);
    this.graffitiObjects.push(newItem);
    this.scene.add(newItem);
  }

  render() {
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
            title="Cube"
            onPress={this.addCube}
            buttonStyle={{
              backgroundColor: 'red',
              opacity: 0.2,
              width: 85,
              height: 85,
            }}
          />
          <Button
            raised
            rounded
            title="Sphere"
            onPress={this.addSphere}
            buttonStyle={{
              backgroundColor: 'green',
              opacity: 0.2,
              width: 85,
              height: 85,
            }}
          />
          <Button
            raised
            rounded
            onPress={this.addTriangle}
            title="Triangle"
            buttonStyle={{
              backgroundColor: 'blue',
              opacity: 0.2,
              width: 85,
              height: 85,
            }}
          />
          <Button
            raised
            rounded
            title="Save"
            onPress={this.addTriangle}
            buttonStyle={{
              backgroundColor: 'purple',
              opacity: 0.2,
              width: 85,
              height: 85,
            }}
          />
        </View>
        {/* <View style={styles.dropView}>
          <Image style={styles.can} source={require('./sprayCan.png')} />
        </View> */}
      </View>
    );
  }

  _onGLContextCreate = async gl => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    // AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

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
    var sphere = new THREE.Mesh(geometry, glassMaterial);
    sphere.position.z = 0.8;

    var light = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(light);

    // this.arPointLight = new ThreeAR.Light();
    // this.arPointLight.position.y = 2;

    const animate = () => {
      requestAnimationFrame(animate);
      this.camera.position.setFromMatrixPosition(this.camera.matrixWorld);
      const cameraPos = new THREE.Vector3(0, 0, 0);
      cameraPos.applyMatrix4(this.camera.matrixWorld);

      this.graffitiObjects.forEach(art => {
        // Animates items for live movement
        // art.rotation.x += art.rotator;
        // art.rotation.y += art.rotator;
      });

      // cube.rotation.x += 0.02;
      // cube.rotation.y += 0.02;

      renderer.render(this.scene, this.camera);
      gl.endFrameEXP();
    };
    animate();
  };
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height - 260,
    left: width / 2 + 100,
  },
  dropView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height - 200,
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
