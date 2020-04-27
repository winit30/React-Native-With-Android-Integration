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
let presignedUrl =
  "https://fc-commoncdn-staging-s3.s3.ap-south-1.amazonaws.com/vkyc/VjAxI2E5ZjU5ZjQ5LWFhZjktNGRiMS1hMWViLTRkOThlOThkMjgxNg/PAN/1587722214066?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200424T095654Z&X-Amz-SignedHeaders=host&X-Amz-Expires=35999&X-Amz-Credential=AKIATYWQQD2TAQXMMZNF%2F20200424%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=2f81e4277a4b9da86f16721a626bc6a3e9298da5eac9d31cf47ddb847c09f054";
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
        path: "images",
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
          console.log("response", response.type);
          this.setState({
            filePath: response,
            fileData: response.data,
            fileUri: response.uri,
          });
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                console.log(xhr);
                // Successfully uploaded the file.
              } else {
                console.log(xhr);
                // The file could not be uploaded.
              }
            }
          };
          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", response.type);
          xhr.send({ uri: response.uri, type: response.type, name: "image" });
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
