import React from 'react';
import {
  Platform, Image, StyleSheet, Text,
} from 'react-native';
import {
  Constants, Location, Permissions, MapView, ImagePicker,
} from 'expo';
import { Button, ThemeProvider } from 'react-native-elements';
import uuidV4 from 'uuid/v4';

const initialRegion = {
  latitude: 48.8534,
  longitude: 2.3488,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  markerThumbnail: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000', // TODO find better color, or add shadow
  },
  markerPopupImage: {
    width: 100,
    height: 100,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 100,
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
      return;
    }
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
  };

  async pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      // allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: true,
    });

    console.log(result);

    if (result.cancelled) {
      return;
    }
    if (!result.exif || typeof result.exif.GPSLatitude !== 'number' || typeof result.exif.GPSLongitude !== 'number') {
      // TODO we should let the user pin a point
      return;
    }
    const { images } = this.state;
    this.setState({
      images: [
        ...images,
        {
          uuid: uuidV4(),
          uri: result.uri,
          latitude: result.exif.GPSLatitude,
          longitude: result.exif.GPSLongitude,
        },
      ],
    });
  }

  render() {
    const { region, userLocation, images } = this.state;
    const showsUserLocation = typeof userLocation === 'object';
    return (
      <ThemeProvider>
        <MapView
          style={styles.mapContainer}
          region={region}
          onRegionChangeComplete={this.onRegionChangeComplete}
          showsUserLocation={showsUserLocation}
        >
          {images.filter(image => typeof image.latitude === 'number' && typeof image.longitude === 'number')
            .map(image => (
              <MapView.Marker
                key={`marker-${image.uuid}`}
                coordinate={{
                  latitude: image.latitude,
                  longitude: image.longitude,
                }}
                title={image.uri}
                description={image.uri}
              >
                <Image source={{ uri: image.uri }} style={styles.markerThumbnail} />
                <MapView.Callout>
                  {/* <Text>Hello</Text> */}
                  <Image source={{ uri: image.uri }} style={styles.markerPopupImage} />
                </MapView.Callout>
              </MapView.Marker>
            ))}
        </MapView>
        <Button
          raised
          icon={{ name: 'add-a-photo' }}
          title="Upload"
          onPress={() => this.pickImage()}
          style={styles.uploadButton}
        />
      </ThemeProvider>
    );
  }
}
