import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import Home from './components/Home';
import CameraView from './components/CameraView';
import LoadArtView from './components/LoadArtView';

const RootNavigator = createStackNavigator({
  Main: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      header: null,
      title: `Graffiti AR`,
    }),
  },
  CameraView: {
    screen: CameraView,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  LoadArtView: {
    screen: LoadArtView,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
});

export default class App extends Component {
  render() {
    return <RootNavigator />;
  }
}
