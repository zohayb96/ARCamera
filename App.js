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
console.disableYellowBox = true;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY(),
    };
    this.model = null;
    this.addCube = this.addCube.bind(this);
  }

  componentWillMount() {
    this._val = { x: 0, y: 0 };
    this.state.pan.addListener(value => (this._val = value));

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y,
        });
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: this.state.pan.x, dy: this.state.pan.y },
      ]),
    });
  }

  // handleDrop = () => {
  //   console.log('PRessed');
  //   const geometry = new THREE.BoxGeometry(0.07, 0.07, 0.07);
  //   const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  //   const thingToDrop = new THREE.Mesh(geometry, customMaterial);
  //   const newItem = dropItem(thingToDrop, this.camera.position);
  //   this.scene.add(newItem);
  // };

  async addCube() {
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new THREE.SphereGeometry(0.8, 0.07, 0.07);
    const customMaterial = new THREE.MeshBasicMaterial({
      map: await ExpoTHREE.createTextureAsync({
        asset: Expo.Asset.fromModule(require('./Glass.jpg')),
      }),
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, customMaterial);
    const newItem = dropItem(mesh, this.camera.position);
    this.scene.add(newItem);
  }

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    return (
      <View style={{ flex: 1 }}>
        <Expo.GLView
          ref={ref => (this._glView = ref)}
          style={{ flex: 1 }}
          onContextCreate={this._onGLContextCreate}
        />
        <View style={styles.colorPicker}>
          <ColorWheel
            initialColor="#00ee00"
            onColorChange={color => console.log({ color })}
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
              opacity: 0.6,
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

    const arSession = await this._glView.startARSessionAsync();

    this.scene = new THREE.Scene();
    this.camera = ExpoTHREE.createARCamera(
      arSession,
      width,
      height,
      0.01,
      1000
    );
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Lighing
    const leftLight = new THREE.DirectionalLight(0xffffff, 0.5);
    const rightLight = new THREE.DirectionalLight(0xffffff, 0.5);
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.5);
    leftLight.position.set(-3, 5, 0).normalize();
    rightLight.position.set(3, 5, 0).normalize();
    bottomLight.position.set(0, -5, 0).normalize();
    this.scene.add(leftLight);
    this.scene.add(rightLight);
    this.scene.add(bottomLight);

    // Ambient Lighting
    var ambient = new THREE.AmbientLight(0x00ffff);
    this.scene.add(ambient);

    const customMaterial = new THREE.MeshBasicMaterial({
      map: await ExpoTHREE.createTextureAsync({
        asset: Expo.Asset.fromModule(require('./custom.jpg')),
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
      arSession,
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
    this.model = cube;
    // scene.add(cube);
    // scene.add(cube1);
    var sphere = new THREE.Mesh(geometry, glassMaterial);
    sphere.position.z = 0.8;
    // scene.add(sphere);
    this.camera.position.z = 5;

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

function dropItem(model, dropPos) {
  const item = model.clone();
  item.position.x = dropPos.x;
  item.position.y = dropPos.y;
  item.position.z = dropPos.z - 0.5;
  item.speed = 0.05;
  return item;
}
