import React, { Component } from "react";
import { View, Image, Text } from "react-native";
import SignaturePad from "react-native-signature-pad";

export default class SignaturePadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileData: "",
    };
  }
  render = () => {
    return (
      <View
        style={{
          backgroundColor: "#eee",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ marginBottom: 8 }}>Add Signature</Text>
        <View style={{ width: 200, height: 200, marginBottom: 16 }}>
          <SignaturePad
            onError={this._signaturePadError}
            onChange={this._signaturePadChange}
            style={{ flex: 1, backgroundColor: "white" }}
          />
        </View>
        {this.state.fileData !== "" && (
          <>
            <Text>Your Signature Image</Text>

            <Image
              source={{ uri: this.state.fileData }}
              style={{
                width: 200,
                height: 200,
                backgroundColor: "#fff",
                marginTop: 16,
              }}
            ></Image>
          </>
        )}
      </View>
    );
  };

  _signaturePadError = (error) => {
    console.error(error);
  };

  _signaturePadChange = ({ base64DataUrl }) => {
    this.setState({
      fileData: base64DataUrl,
    });
    console.log("Got new signature: " + base64DataUrl);
  };
}
