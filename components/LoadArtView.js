import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  PanResponder,
  Animated,
  Alert,
} from 'react-native';
import axios from 'axios';
import Expo from 'expo';
import { AR } from 'expo';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import { Button } from 'react-native-elements';
import { ColorWheel } from 'react-native-color-wheel';
var convert = require('color-convert');
var hsl = require('hsl-to-hex');
import Icon from 'react-native-vector-icons/FontAwesome';

console.disableYellowBox = true;

export default class CameraView extends React.Component {
  constructor() {
    super();
    this.state = {
      singleArt: {},
    };
    this.handleLoad = this.handleLoad.bind(this);
  }

  async handleLoad() {
    let loader = new THREE.ObjectLoader();
    const response = await axios.get(`http://172.16.21.129:8080/api/art/8`);
    this.setState({
      singleArt: response.data,
    });
    const sceneJson = response.data.artPiece;
    const artToLoad = loader.parse(sceneJson);
    console.log('artToLoad: ', artToLoad);
    this.scene.add(artToLoad);
    console.log('Loading');
    // console.log(this.state);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Expo.GLView
          ref={ref => (this._glView = ref)}
          style={{ flex: 1 }}
          onContextCreate={this._onGLContextCreate}
        />
        <View style={styles.drop}>
          <Button
            raised
            rounded
            title="Load Scene"
            onPress={this.handleLoad}
            buttonStyle={{
              backgroundColor: 'purple',
              opacity: 0.2,
              width: 85,
              height: 85,
            }}
          />
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
        asset: Expo.Asset.fromModule(require('../uv.jpg')),
      }),
      transparent: true,
    });

    const glassMaterial = new THREE.MeshBasicMaterial({
      map: await ExpoTHREE.createTextureAsync({
        asset: Expo.Asset.fromModule(require('../Glass.jpg')),
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
    top: height - 350,
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
      asset: Expo.Asset.fromModule(require('../uv.jpg')),
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
