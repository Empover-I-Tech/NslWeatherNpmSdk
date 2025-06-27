import React from 'react';
import { Modal, View,Text, Image,TouchableOpacity,StyleSheet, TouchableWithoutFeedback} from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { translate } from '../Localization/Localisation';
import { requestCameraPermission,requestGalleryPermission } from '../Utility/Permissions';

const CustomGalleryPopup = ({ showOrNot, onPressingOut, onPressingGallery, onPressingCamera }) => {

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
        style={stylesheetStyes.overallContainer}
      >
        <TouchableWithoutFeedback>
          <View style={stylesheetStyes.subContainer}>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                padding: 15,
                zIndex: 100
              }}
              onPress={onPressingOut}>
              <Image source={require('../assets/Images/crossMark.png')} style={{ tintColor:"#000", height: 20, width: 20, resizeMode: "contain" }} />
            </TouchableOpacity>
            <View style={stylesheetStyes.galleryImage}>
              <Text style={[stylesheetStyes.uploadText, { color:"#000" },]}>
                {translate('UploadImage')}
              </Text>
              <View style={stylesheetStyes.cameraOverallView}>
                <View style={stylesheetStyes.cameraView}>
                  <TouchableOpacity
                    onPress={handleCameraPress}
                    style={[stylesheetStyes.viewTwentyOne, {
                      backgroundColor:"rgba(237, 50, 55, 0.1)"
                    }]}
                  >
                    <Image
                      source={require('../assets/Images/cameraIcon.png')}
                      style={[stylesheetStyes.image3, { tintColor:"#ED3237" }]}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <Text style={[stylesheetStyes.text11, { color:"#000" },]}>{translate('camera')}</Text>
                </View>
                <View style={stylesheetStyes.cameraView}>
                  <TouchableOpacity
                    onPress={handleGalleryPress}
                    style={[stylesheetStyes.viewTwentyOne, {
                      backgroundColor: 'rgba(237, 50, 55, 0.1)'
                    }]}
                  >
                    <Image
                      source={require('../assets/Images/galleryIcon.png')}
                      style={[stylesheetStyes.image3, { tintColor:"#ED3237" }]}
                      resizeMode="contain"
                    />

                  </TouchableOpacity>
                  <Text style={[stylesheetStyes.text11, { color:"#000" },]}>{translate('gallery')}</Text>
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  viewTen: { marginLeft: responsiveWidth(2.5) },
  imgTwo: {
    height: 50,
    width: 50,
    borderRadius: 6,
  },
  textFive: { marginBottom: responsiveHeight(1) },
  viewTwelve: { marginTop: 20 },
  textSeven: {
    textAlign: "center",
    // color: COLORS.paragraphText
  },
  textSix: {
    position: "absolute",
    right: responsiveWidth(1),
    bottom: responsiveHeight(0),
    fontSize: responsiveFontSize(1.5),
    color: "rgba(37,39,73,0.5)",
  },
  viewEleven: {
    height: responsiveHeight(35),
    width: responsiveWidth(100),
    backgroundColor: "rgba(255,255,255,1)",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  uploadText: {
    fontSize: responsiveFontSize(2.3),
    marginLeft: responsiveWidth(5),
    marginTop: responsiveHeight(4),
    // color: COLORS.darkBlueGrey,
    fontWeight: "bold",
  },
  textEight: { fontSize: responsiveFontSize(3) },
  viewThirteen: { padding: responsiveHeight(1) },
  touchOne: {
    flexDirection: "row",
    height: responsiveHeight(6),
    borderRadius: 50,
    margin: responsiveHeight(1),
    width: responsiveWidth(12),
    alignItems: "center",
    justifyContent: "center",
  },
  subContainer: {
    height: responsiveHeight(22.5),
    width: responsiveWidth(100),
    backgroundColor: "#fff",
    marginTop: 'auto',
    paddingBottom: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
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
  touchTwo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0.3,
    borderBottomColor: "rgba(37,39,73,0.1)",
  },
  viewNine: { flexDirection: "row" },
  scrollViewStyle: { flex: 1, backgroundColor: "rgba(255,255,255,1)" },
  textFour: {
    //  color: COLORS.petwatchOrange
  },
  viewEight: {
    // borderColor: COLORS.petwatchOrange,
    borderRadius: responsiveHeight(1),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: responsiveHeight(0.1),
    height: responsiveHeight(5),
    width: responsiveWidth(25),
    marginRight: responsiveWidth(5),
  },
  textThree: {
    //  color: COLORS.paragraphText
  },
  textTwo: {
    marginRight: responsiveWidth(2),
    // color: COLORS.petwatchOrange
  },
  viewSeven: { paddingLeft: responsiveWidth(5) },
  viewSix: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: responsiveHeight(0.5),
  },
  viewFive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F1F1F1",
    height: responsiveHeight(10),
    width: responsiveWidth(100),
  },
  cameraView: { alignItems: "center", justifyContent: "center" },
  viewFour: { marginLeft: responsiveWidth(2) },
  textOne: {
    marginLeft: responsiveWidth(3),
    // color: COLORS.darkBlueGrey,
    fontSize: responsiveFontSize(2.2),
  },
  imgOne: {
    height: 50,
    width: 50,
    borderRadius: 6,
  },
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
  viewThree: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: responsiveWidth(70),
  },
  viewOne: {
    height: responsiveHeight(8),
    width: responsiveWidth(100),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,1)",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  overallContainer: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  viewTwo: { padding: responsiveWidth(4) },
  outerContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
    marginTop: responsiveHeight(3),
  },
  topContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
  },
  messageContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "rgba(37,39,73,0.1)",
    width: responsiveWidth(75),
  },
  avatar: {
    marginTop: responsiveHeight(2),
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: responsiveHeight(1),
  },
  trueBorder: {
    borderBottomLeftRadius: responsiveHeight(2),
    borderBottomRightRadius: responsiveHeight(2),
    borderTopRightRadius: responsiveHeight(2),
    backgroundColor: "rgba(254, 91, 87,0.1)",
  },
  falseBorder: {
    borderBottomLeftRadius: responsiveHeight(2),
    borderBottomRightRadius: responsiveHeight(2),
    borderTopLeftRadius: responsiveHeight(2),
  },
  leftMargin: { marginRight: 16 },
  rightMargin: { marginLeft: 16 },
  avatarContent: {
    fontSize: 30,
    textAlign: "center",
    textAlignVertical: "center",
  },
  messageContent: {
    padding: responsiveHeight(1),
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: responsiveHeight(2),
    padding: 3,
    backgroundColor: "#F4F4F4",
    width: responsiveWidth(90),
    marginLeft: responsiveWidth(5),
    borderRadius: responsiveHeight(3),
    marginBottom: responsiveHeight(3),
  },
  textInput: {
    backgroundColor: "#F4F4F4",
    width: responsiveWidth(64),
    marginLeft: responsiveWidth(3),
    padding: 16,
  },
  submit: { marginLeft: responsiveWidth(2) },
  view4: { borderRadius: responsiveHeight(60) },
  viewSafe: { flex: 1, backgroundColor: "white" },
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
