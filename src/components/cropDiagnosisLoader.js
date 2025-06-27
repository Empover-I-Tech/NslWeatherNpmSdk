import React from 'react';
import { Text, View, Modal, Image, Dimensions,StyleSheet } from 'react-native';

const CustomDiagnosticsLoader = ({ loading = false, fill = 10, message = "Loading...", loaderImage,fromCropDiag = false }) => {
  return (
    <Modal
      supportedOrientations={['portrait', 'landscape']}
      transparent={true}
      animationType="fade"
      visible={true}
      onRequestClose={() => console.log('close modal')}
    >
      <View style={styles.modalMainContainer}>
         <Image
          source={ loaderImage}
          style={styles.gifIcon}
          resizeMode="contain"
        />
        <Text
          style={styles.gifMssg}
        >
          {message}
        </Text>
      </View>
    </Modal>
  );
};

const styles=StyleSheet.create({
  modalMainContainer:{
    backgroundColor: "#000000d6", 
    position: "absolute", 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    alignItems: "center",
    justifyContent:"center"
  },
  gifIcon:{
    alignSelf:"center",
    width: 150, 
    height: 150, 
    marginTop: -75
  },
  gifMssg:{
    fontSize:13,
    paddingLeft:10,
    top:10,
    top:30,
    color:"#fff",
    textAlign:"center",
    lineHeight:25
  }

})

export default CustomDiagnosticsLoader;
