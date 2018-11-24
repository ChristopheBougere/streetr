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
    images: [],
  };

  componentWillMount() {
    this.getLocationAsync();
  }

  onRegionChangeComplete = (region) => {
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
    const { images } = this.state;
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: true,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({
        images: [
          ...images,
          {
            uri: result.uri,
            latitude: result.exif && result.exif.GPSLatitude || null,
            longitude: result.exif && result.exif.GPSLongitude || null,
          },
        ],
      });
    }
  }

  render() {
    const { region, userLocation, images } = this.state;
    const showsUserLocation = typeof userLocation === 'object';
    return (
      <ThemeProvider>
        <View style={styles.container}>
          <MapView
            style={{ flex: 1 }}
            region={region}
            onRegionChangeComplete={this.onRegionChangeComplete}
            showsUserLocation={showsUserLocation}
          >
            {images.filter(image => typeof image.latitude === 'number' && typeof image.longitude === 'number')
              .map((image, i) => (
              <MapView.Marker
                key={`marker-${i}`}
                coordinate={{
                  latitude: image.latitude,
                  longitude: image.longitude,
                }}
                title={image.uri}
                description={image.uri}
              >
                <Image source={{ uri: image.uri }} style={{ width: 30, height: 30 }} />
              </MapView.Marker>
            ))}
          </MapView>
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
