import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import { SvgCss } from 'react-native-svg';

import { CryptoModule, GCMCryptoModule } from './NativeUtils';

CryptoModule.show('Awesome', 4);

CryptoModule.encrypt("some text goes here", "test1234", (msg) => {
    alert(msg);
});

GCMCryptoModule.nativeEncrypt('This is test data', 'thisisthetestkey',(msg) => {
  console.log('err', msg);
},(encryptedData) => {
  console.log(encryptedData);
});

GCMCryptoModule.nativeDecrypt('AAAADAAAAAAAAAAAAAAAAMj7e0MHUabJOGXPmsXaI2Xt1icsljhWuK7k0IWe0TXa1g==', 'thisisthetestkey',(msg) => {
  console.log('err', msg);
},(encryptedData) => {
  console.log(encryptedData);
});

class HelloUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null
    }
  }

  takePicture = async() => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      this.setState({
        imageUrl: data.uri
      });
    }
  };

  render() {

    const svgXml = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13">
          <g fill="#222" fill-rule="evenodd" transform="translate(.446)">
              <rect width="1.152" height="12.674" x="5.94" rx=".576"/>
              <path d="M12.853 6.337c0 .318-.258.576-.576.576H.755c-.318 0-.576-.258-.576-.576 0-.318.258-.576.576-.576h11.522c.318 0 .576.258.576.576z"/>
          </g>
      </svg>
      `;

    return (
      <View style={styles.container}>
      {this.state.imageUrl && <Image style={{width: 200, height: 200}} source={{uri: this.state.imageUrl}} /> }
        <View style={styles.container}>
          <SvgCss xml={svgXml} width="100%" height="100%" />
        </View>

      </View>
    )
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

AppRegistry.registerComponent('AwesomeReactApp', () => HelloUser);
