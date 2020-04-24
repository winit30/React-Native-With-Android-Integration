import React, { Component, Fragment } from "react";
import {
  Image,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImagePicker from "react-native-image-picker";
import styles from "./imagepicker.style";

export default class ImagePickerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filepath: {
        data: "",
        uri: "",
      },
      fileData: "",
      fileUri: "",
    };
  }

  chooseImage = async () => {
    let options = {
      title: "Select Image",
      storageOptions: {
        skipBackup: true,
        path: "images"
      },
    };
    try {
      ImagePicker.showImagePicker(options, (response) => {
        console.log("Response = ", response);

        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
          alert(response.customButton);
        } else {
          console.log("response", JSON.stringify(response));
          this.setState({
            filePath: response,
            fileData: response.data,
            fileUri: response.uri,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  launchCamera = async () => {
   
    let options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log("response", JSON.stringify(response));
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
      }
    });
  };

  launchImageLibrary = async () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log("response", JSON.stringify(response));
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
      }
    });
  };

  renderFileData() {
    if (this.state.fileData) {
      return (
        <Image
          source={{ uri: "data:image/jpeg;base64," + this.state.fileData }}
          style={styles.images}
        />
      );
    } else {
      return (
        <Image
          source={require("../../../assets/dummy.png")}
          style={styles.images}
        />
      );
    }
  }

  renderFileUri() {
    if (this.state.fileUri) {
      return (
        <Image source={{ uri: this.state.fileUri }} style={styles.images} />
      );
    } else {
      return (
        <Image
          source={require("../../../assets/galeryImages.jpg")}
          style={styles.images}
        />
      );
    }
  }
  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.body}>
            <Text
              style={{ textAlign: "center", fontSize: 20, paddingBottom: 10 }}
            >
              Pick Images from Camera & Gallery
            </Text>
            <View style={styles.ImageSections}>
              <View>
                {this.renderFileData()}
                <Text style={{ textAlign: "center" }}>Base 64 String</Text>
              </View>
              <View>
                {this.renderFileUri()}
                <Text style={{ textAlign: "center" }}>File Uri</Text>
              </View>
            </View>

            <View style={styles.btnParentSection}>
              <TouchableOpacity
                onPress={this.chooseImage}
                style={styles.btnSection}
              >
                <Text style={styles.btnText}>Choose File</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.launchCamera}
                style={styles.btnSection}
              >
                <Text style={styles.btnText}>Directly Launch Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.launchImageLibrary}
                style={styles.btnSection}
              >
                <Text style={styles.btnText}>
                  Directly Launch Image Library
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}
