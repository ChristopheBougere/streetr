import React from 'react';
import {
  Platform, Image, StyleSheet, View,
} from 'react-native';
import {
  Constants, Location, Permissions, MapView, ImagePicker,
} from 'expo';
import { Button, ThemeProvider } from 'react-native-elements';

const initialRegion = {
  latitude: 48.8534,
  longitude: 2.3488,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default class App extends React.Component {
  state = {
    region: initialRegion,
    userLocation: null,
    image: null,
  };

  componentWillMount() {
    this.getLocationAsync();
  }

  onRegionChange = (region) => {
    this.setState({ region });
  }

  getLocationAsync = async () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.log('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }

      const location = await Location.getCurrentPositionAsync({});
      this.setState({
        userLocation: location,
        region: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: initialRegion.latitudeDelta,
          longitudeDelta: initialRegion.longitudeDelta,
        },
      });
    }
  };

  async pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  }

  render() {
    const { region, userLocation, image } = this.state;
    const showsUserLocation = typeof userLocation === 'object';
    return (
      <ThemeProvider>
        <View style={styles.container}>
          <MapView
            style={{ flex: 1 }}
            region={region}
            onRegionChange={this.onRegionChange}
            showsUserLocation={showsUserLocation}
          />
          {
            image
            && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
          }
          <Button
            raised
            icon={{ name: 'add-a-photo' }}
            title="Upload"
            onPress={() => this.pickImage()}
          />
        </View>
      </ThemeProvider>
    );
  }
}
