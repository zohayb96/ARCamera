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
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

console.disableYellowBox = true;

export default class LoadArtView extends React.Component {
  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY(),
      color: null,
      hexColor: '#FFFFFF',
      latitude: null,
      longitude: null,
      shape: 'cube',
      size: 'medium',
      texture: 'color',
    };
    this.model = null;
    this.graffitiObjects = [];
    // this.addCube = this.addCube.bind(this);
    // this.addSphere = this.addSphere.bind(this);
    // this.addTriangle = this.addTriangle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findColor = this.findColor.bind(this);
    this.findShape = this.findShape.bind(this);
    this.findSize = this.findSize.bind(this);
    this.addShapeWithSize = this.addShapeWithSize.bind(this);
    this.findCustomMaterial = this.findCustomMaterial.bind(this);
  }

  // Menu
  _menu = {};
  setMenuRef = (ref, type) => {
    this._menu[type] = ref;
  };
  hideMenu = type => {
    this._menu[type].hide();
  };
  showMenu = type => {
    this._menu[type].show();
  };

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

  // async componentWillMount() {
  //   Permissions.askAsync(Permissions.CAMERA_ROLL);
  //   Permissions.askAsync(Permissions.CAMERA);
  // }

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

  // async addCube() {
  //   const glassMaterial = new THREE.MeshBasicMaterial({
  //     map: await ExpoTHREE.createTextureAsync({
  //       asset: Expo.Asset.fromModule(require('../Glass.jpg')),
  //     }),
  //     transparent: true,
  //     opacity: 0.85,
  //   });
  //   const colorToUse = this.findColor();
  //   const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  //   var material = new THREE.MeshBasicMaterial({
  //     color: colorToUse,
  //     transparent: true,
  //     opacity: 0.85,
  //   });
  //   const mesh = new THREE.Mesh(geometry, material);
  //   const newItem = setModelPos(mesh, this.camera.position);
  //   newItem.castShadow = true;
  //   this.graffitiObjects.push(newItem);
  //   this.scene.add(newItem);
  // }

  findSize() {
    if (this.state.size === 'medium') {
      return 0.1;
    } else if (this.state.size === 'large') {
      return 0.15;
    } else {
      return 0.05;
    }
  }

  findShape(sizeToUse) {
    if (this.state.shape === 'sphere') {
      return new THREE.SphereGeometry(sizeToUse, 64, 64);
    } else if (this.state.shape === 'pyramid') {
      return new THREE.TetrahedronBufferGeometry(sizeToUse, 0);
    } else {
      return new THREE.BoxGeometry(sizeToUse, sizeToUse, sizeToUse);
    }
  }

  // async addTriangle() {
  //   const colorToUse = this.findColor();
  //   var material = new THREE.MeshBasicMaterial({
  //     color: colorToUse,
  //     opacity: 0.85,
  //     transparent: true,
  //   });
  //   const mesh = new THREE.Mesh(
  //     new THREE.TetrahedronBufferGeometry(0.1, 0),
  //     material
  //   );
  //   const newItem = setModelPos(mesh, this.camera.position);
  //   this.graffitiObjects.push(newItem);
  //   this.scene.add(newItem);
  // }

  async findCustomMaterial() {
    if (this.state.texture === 'glass') {
      return (material = new THREE.MeshBasicMaterial({
        map: await ExpoTHREE.createTextureAsync({
          asset: Expo.Asset.fromModule(require('../Glass.jpg')),
        }),
        transparent: true,
        opacity: 0.7,
      }));
    } else if (this.state.texture === 'fire') {
      return (material = new THREE.MeshBasicMaterial({
        map: await ExpoTHREE.createTextureAsync({
          asset: Expo.Asset.fromModule(require('../Fire.jpg')),
        }),
        transparent: true,
      }));
    } else if (this.state.texture === 'wood') {
      return (material = new THREE.MeshBasicMaterial({
        map: await ExpoTHREE.createTextureAsync({
          asset: Expo.Asset.fromModule(require('../Wood.jpg')),
        }),
        transparent: true,
      }));
    } else if (this.state.texture === 'water') {
      return (material = new THREE.MeshBasicMaterial({
        map: await ExpoTHREE.createTextureAsync({
          asset: Expo.Asset.fromModule(require('../Water.jpg')),
        }),
        transparent: true,
        opacity: 0.7,
      }));
    } else if (this.state.texture === 'minecraft') {
      return (material = new THREE.MeshBasicMaterial({
        map: await ExpoTHREE.createTextureAsync({
          asset: Expo.Asset.fromModule(require('../Minecraft.jpg')),
        }),
        transparent: true,
      }));
    } else {
      return (material = new THREE.MeshBasicMaterial({
        map: await ExpoTHREE.createTextureAsync({
          asset: Expo.Asset.fromModule(require('../uv.jpg')),
        }),
        transparent: true,
      }));
    }
  }

  // async addSphere() {
  //   const colorToUse = this.findColor();
  //   console.log(colorToUse);
  //   console.log(this.graffitiObjects);
  //   const sphereGeometry = new THREE.SphereGeometry(0.1, 0.1, 0.1);
  //   var material = new THREE.MeshBasicMaterial({
  //     color: colorToUse,
  //     opacity: 0.75,
  //     transparent: true,
  //   });
  //   const mesh = new THREE.Mesh(sphereGeometry, material);
  //   // console.log(this.state);
  //   const newItem = setModelPos(mesh, this.camera.position);
  //   this.graffitiObjects.push(newItem);
  //   this.scene.add(newItem);
  // }

  // Add selected shape of selected size
  async addShapeWithSize() {
    // get all shapes and sizes to use
    const sizeToUse = this.findSize();
    const objectToRender = this.findShape(sizeToUse);
    const colorToUse = this.findColor();
    let material = '';
    if (this.state.texture === 'color') {
      material = new THREE.MeshBasicMaterial({ color: colorToUse });
    } else {
      material = await this.findCustomMaterial();
    }
    const mesh = new THREE.Mesh(objectToRender, material);
    const newItem = setModelPos(mesh, this.camera.position);
    this.graffitiObjects.push(newItem);
    this.scene.add(newItem);
  }

  async handleSubmit(evt) {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    if (this.state.latitude === null || this.state.longitude === null) {
      this.showFailAlert();
    } else {
      const locationToSave = [this.state.latitude, this.state.longitude];
      console.log('Location', locationToSave);
      try {
        let count = 0;
        const newArt = await axios.post(
          'http://172.16.21.129:8080/api/art/add',
          {
            location: locationToSave,
            artPiece: this.scene.toJSON(),
            description: 'Amazing art piece, love it',
            likes: 10,
          }
        );
        console.log('SUCCESS');
        this.showAlert();
      } catch (err) {
        console.log(err);
        this.showFailAlert();
      }
    }
  }

  showAlert = () => {
    Alert.alert(
      'Posted!',
      'Awesome!',
      [{ text: ':)', onPress: () => console.log('Posted') }],
      { cancelable: false }
    );
  };

  // Message to user when post fails
  showFailAlert = () => {
    Alert.alert(
      'Failed To Add!',
      'Error!',
      [
        {
          text: 'Please Try Again',
          onPress: () => console.log('Error'),
        },
      ],
      { cancelable: false }
    );
  };

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
          {/* Pick shape from list menu */}
          <Menu
            ref={ref => this.setMenuRef(ref, 'shape')}
            button={
              <Button
                raised
                rounded
                title="Shape"
                onPress={() => this.showMenu('shape')}
                buttonStyle={{
                  backgroundColor: 'red',
                  opacity: 0.5,
                  width: 'auto',
                  height: 50,
                }}
              />
            }
          >
            <MenuItem onPress={() => this.setState({ shape: 'cube' })}>
              Cube
            </MenuItem>
            <MenuItem onPress={() => this.setState({ shape: 'sphere' })}>
              Sphere
            </MenuItem>
            <MenuItem onPress={() => this.setState({ shape: 'pyramid' })}>
              Pyramid
            </MenuItem>
          </Menu>
          {/* <Button
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
          /> */}
          {/* <Button
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
            onPress={this.handleSubmit}
            buttonStyle={{
              backgroundColor: 'purple',
              opacity: 0.2,
              width: 85,
              height: 85,
            }} */}
          {/* /> */}
        </View>
        <View style={styles.size}>
          <Menu
            ref={ref => this.setMenuRef(ref, 'size')}
            button={
              <Button
                raised
                rounded
                title="size"
                onPress={() => this.showMenu('size')}
                buttonStyle={{
                  backgroundColor: 'purple',
                  opacity: 0.5,
                  width: 'auto',
                  height: 50,
                }}
              />
            }
          >
            <MenuItem onPress={() => this.setState({ size: 'small' })}>
              Small
            </MenuItem>
            <MenuItem onPress={() => this.setState({ size: 'medium' })}>
              Medium
            </MenuItem>
            <MenuItem onPress={() => this.setState({ size: 'large' })}>
              Large
            </MenuItem>
          </Menu>
          <Menu
            ref={ref => this.setMenuRef(ref, 'texture')}
            button={
              <Button
                raised
                rounded
                title="Texture"
                onPress={() => this.showMenu('texture')}
                buttonStyle={{
                  backgroundColor: 'green',
                  opacity: 0.5,
                  width: 'auto',
                  height: 50,
                }}
              />
            }
          >
            <MenuItem onPress={() => this.setState({ texture: 'glass' })}>
              Glass
            </MenuItem>
            <MenuItem onPress={() => this.setState({ texture: 'fire' })}>
              Fire
            </MenuItem>
            <MenuItem onPress={() => this.setState({ texture: 'wood' })}>
              Wood
            </MenuItem>
            <MenuItem onPress={() => this.setState({ texture: 'minecraft' })}>
              Minecraft
            </MenuItem>
            <MenuItem onPress={() => this.setState({ texture: 'water' })}>
              Water
            </MenuItem>
            <MenuItem onPress={() => this.setState({ texture: 'color' })}>
              Color
            </MenuItem>
          </Menu>
          <Button
            raised
            rounded
            title=" Photo"
            buttonStyle={{
              backgroundColor: 'blue',
              opacity: 0.5,
              width: 'auto',
              height: 50,
            }}
          />
          {/* <Button
            raised
            rounded
            onPress={this.addTriangle}
            title="Tri"
            buttonStyle={{
              backgroundColor: 'orange',
              opacity: 0.5,
              width: 85,
              height: 50,
            }}
          /> */}
          <Button
            raised
            rounded
            title="Save"
            onPress={this.handleSubmit}
            buttonStyle={{
              backgroundColor: 'black',
              opacity: 0.5,
              width: 85,
              height: 50,
            }}
          />
          <Button
            raised
            rounded
            title="log"
            onPress={this.addShapeWithSize}
            buttonStyle={{
              backgroundColor: 'yellow',
              opacity: 0.5,
              width: 85,
              height: 50,
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
    // this.model = await loadModel(this.state.color);
    var sphere = new THREE.Mesh(geometry, glassMaterial);
    sphere.position.z = 0.8;

    // this.arPointLight = new ThreeAR.Light();
    // this.arPointLight.position.y = 2;
    // Lights

    // var ambientLight = new THREE.AmbientLight(0x606060);
    // this.scene.add(ambientLight);
    // var directionalLight = new THREE.DirectionalLight(0xffffff);
    // directionalLight.position.x = Math.random() - 0.5;
    // directionalLight.position.y = Math.random() - 0.5;
    // directionalLight.position.z = Math.random() - 0.5;
    // directionalLight.position.normalize();
    // this.scene.add(directionalLight);
    // var directionalLight = new THREE.DirectionalLight(0x808080);
    // directionalLight.position.x = Math.random() - 0.5;
    // directionalLight.position.y = Math.random() - 0.5;
    // directionalLight.position.z = Math.random() - 0.5;
    // directionalLight.position.normalize();
    // this.scene.add(directionalLight);

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
    top: height - 600,
    left: width / 2 + 100,
  },
  size: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height - 550,
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

// async function loadModel(hexcolor) {
//   const geometry = new THREE.BoxGeometry(0.07, 0.07, 0.07);
//   var material = new THREE.MeshBasicMaterial({ color: '#FFFFFFF' });
//   const sphere = new THREE.SphereGeometry(0.1, 0.07, 0.07);
//   const customMaterial = new THREE.MeshBasicMaterial({
//     map: await ExpoTHREE.createTextureAsync({
//       asset: Expo.Asset.fromModule(require('../uv.jpg')),
//     }),
//     transparent: true,
//     opacity: 0.75,
//   });
//   const mesh = new THREE.Mesh(geometry, material);
//   return mesh;
// }

function setModelPos(model, dropPos) {
  const item = model.clone();
  item.position.x = dropPos.x;
  item.position.y = dropPos.y;
  item.position.z = dropPos.z;
  item.rotator = 0.02;
  return item;
}
