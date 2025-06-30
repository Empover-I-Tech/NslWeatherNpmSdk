import React from 'react';
import { Modal, View,Text, Image,TouchableOpacity,StyleSheet, TouchableWithoutFeedback} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { translate } from '../Localization/Localisation';
import { requestCameraPermission,requestGalleryPermission } from '../Utility/Permissions';
import {useColors } from '../colors/Colors';

const CustomGalleryPopup = ({ showOrNot, onPressingOut, onPressingGallery, onPressingCamera }) => {
  const Colors=useColors()
  const handleCameraPress = async () => {
    const { granted } = await requestCameraPermission(translate);
    if (granted) {
      onPressingCamera();
    }
  };

  const handleGalleryPress = async () => {
    const { granted } = await requestGalleryPermission(translate);
    if (granted) {
      onPressingGallery();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showOrNot} //showOrNot   showSelectionModal
      onRequestClose={onPressingOut} //onPressingOut () =>  setShowSelectionModal(false)
    >
      <TouchableOpacity
        testID="openAttachmentModal"
        onPressOut={onPressingOut} //onPressingOut () =>  setShowSelectionModal(false)
        style={[stylesheetStyes.overallContainer,{backgroundColor:Colors.transparent,}]}
      >
        <TouchableWithoutFeedback>
          <View style={[stylesheetStyes.subContainer,{backgroundColor: Colors.white_color,shadowColor:Colors.black_color,}]}>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                padding: 15,
                zIndex: 100
              }}
              onPress={onPressingOut}>
              <Image source={require('../assets/Images/crossMark.png')} style={{ tintColor:Colors.black_color, height: 20, width: 20, resizeMode: "contain" }} />
            </TouchableOpacity>
            <View style={stylesheetStyes.galleryImage}>
              <Text style={[stylesheetStyes.uploadText, { color:Colors.black_color },]}>
                {translate('UploadImage')}
              </Text>
              <View style={stylesheetStyes.cameraOverallView}>
                <View style={stylesheetStyes.cameraView}>
                  <TouchableOpacity
                    onPress={handleCameraPress}
                    style={[stylesheetStyes.viewTwentyOne, {
                      backgroundColor:Colors.Crimson_Red
                    }]}
                  >
                    <Image
                      source={require('../assets/Images/cameraIcon.png')}
                      style={[stylesheetStyes.image3, { tintColor:Colors.app_theme_color}]}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <Text style={[stylesheetStyes.text11, { color:Colors.black_color },]}>{translate('camera')}</Text>
                </View>
                <View style={stylesheetStyes.cameraView}>
                  <TouchableOpacity
                    onPress={handleGalleryPress}
                    style={[stylesheetStyes.viewTwentyOne, {
                      backgroundColor:Colors.Crimson_Red
                    }]}
                  >
                    <Image
                      source={require('../assets/Images/galleryIcon.png')}
                      style={[stylesheetStyes.image3, { tintColor:Colors.app_theme_color }]}
                      resizeMode="contain"
                    />

                  </TouchableOpacity>
                  <Text style={[stylesheetStyes.text11, { color:Colors.black_color },]}>{translate('gallery')}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const stylesheetStyes = StyleSheet.create({
  uploadText: {
    fontSize: responsiveFontSize(2.3),
    marginLeft: responsiveWidth(5),
    marginTop: responsiveHeight(4),
    // color: COLORS.darkBlueGrey,
    fontWeight: "bold",
  },
  subContainer: {
    height: responsiveHeight(22.5),
    width: responsiveWidth(100),
    marginTop: 'auto',
    paddingBottom: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  image3: {
    height: responsiveHeight(4),
    width: responsiveWidth(8),
  },
  text11: {
    // color: COLORS.darkBlueGrey,
    fontWeight: "bold",
    marginRight: responsiveWidth(10),
    marginTop: responsiveHeight(2),
  },

  cameraView: { alignItems: "center", justifyContent: "center" },


  viewTwentyOne: {
    height: responsiveHeight(8),
    width: responsiveWidth(16),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginRight: responsiveWidth(10),
  },
  cameraOverallView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: responsiveHeight(1),
    marginLeft: responsiveWidth(5),
  },
  galleryImage: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },

  overallContainer: {
    flex: 1,
  },

  image: {
    minWidth: responsiveWidth(50),
    minHeight: responsiveHeight(50),
    marginBottom: responsiveHeight(1),
  },
  pdf: {
    padding: 7,
    fontSize: responsiveFontSize(1.5),
    fontWeight: "600",
    lineHeight: 5,
  },
  fastImageOne: {
    height: responsiveHeight(10),
    width: responsiveWidth(20),
    marginBottom: responsiveHeight(2),
  },
  touchThree: {
    height: responsiveHeight(15),
    alignItems: "center",
    justifyContent: "center",
  },
});


export default CustomGalleryPopup;
