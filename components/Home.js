import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Button from './Button';
// Button to link to login and sign up page
// Possible Oauth

const Home = ({ navigation }) => (
  <View style={styles.container}>
    <Button onPress={() => navigation.navigate(`CameraView`)}>Add Art</Button>
    <Button onPress={() => navigation.navigate(`LoadArtView`)}>Load Art</Button>
  </View>
);

const styles = {
  container: {
    flex: 1,
    alignItems: `center`,
    justifyContent: `center`,
    backgroundColor: '#ffffff',
  },
};

export default Home;
