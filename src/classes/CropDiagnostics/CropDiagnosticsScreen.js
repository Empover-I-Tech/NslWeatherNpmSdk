import { Text, View, FlatList, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import CustomHeaders from '../../components/CustomeHeaders';
import { translate } from '../../Localization/Localisation';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import CustomButton from '../../components/CustomButton'
import { Colors } from '../../colors/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import CustomLoader from '../../components/CustomLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomGalleryPopup from '../../components/CustomGalleryPopup';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import ImageResizer from 'react-native-image-resizer';
import Geolocation from '@react-native-community/geolocation';
import ApiConfig, { STATUS_CODE_SUCCESS_200 } from '../../Networks/ApiConfig';
import ApiService from '../../Networks/ApiService';
import { isNullOrEmptyNOTTrim } from '../../Utility/Utils';
import CustomDiagnosticsLoader from '../../components/cropDiagnosisLoader';

const CropDiagnosticsScreen = ({ route }) => {
  const [loading, setLoading] = useState(false)
  const [cropLoading, setCropLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState(translate('Crop_Diagnostic'));
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [ImageData, setImageData] = useState(null);
  const [cameraRelatedPopUp, setCameraRelatedPopUp] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [fromGallery, setFromGallery] = useState(false);
  const [diseases, setDiseases] = useState([]);
  const { isConnected } = useSelector(state => state.network);
  const navigation = useNavigation()
  const [loadingMessage, setLoadingMessage] = useState('')
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    if (selectedFilter === translate('history')) {
      getHistory();
    }
  }, [selectedFilter]);

  useEffect(() => {
    GetUserLocation()
  }, [])

  const GetUserLocation = async () => {
    if (isConnected) {
      try {
        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLatitude(latitude)
            setLongitude(longitude)
            setCoordinates(position.coords)
          },
          (error) => {
            if (error.code === 3 || error.code === 2) {
              Geolocation.getCurrentPosition(
                async (position) => {
                  const { latitude, longitude } = position.coords;
                  setLatitude(latitude)
                  setLongitude(longitude)
                },
                () => console.log("checking"),
                { enableHighAccuracy: false, timeout: 10000, maximumAge: 5000 },
              );
            }
          },
          { enableHighAccuracy: true, timeout: 3000, maximumAge: 1000 }
        );
      } catch (err) {
        console.error("Unexpected error:", err);
        Alert.alert(translate("Error"), translate("An_unexpected_error_occurred_Please_try_again"));
      }
    } else {
      SimpleToast.show(translate("no_internet_conneccted"))
    }
  }

  const getHistory = async () => {
    if (isConnected) {
      try {
        setLoading(true)
        setCropLoading(false);
        setLoadingMessage(translate('please_wait_getting_data'))
        const getCropDiseaseHistoryUrl = ApiConfig.BASE_URL_NVM + ApiConfig.CROPDIAGNOSTICS.CROPDISEASEIDENTIFICATIONHISTORY
        const responseResult = await ApiService.get(getCropDiseaseHistoryUrl);
        if (responseResult?.statusCode === STATUS_CODE_SUCCESS_200) {
          setLoading(false)
          setDiseases(responseResult?.response || []);
        } else {
          setLoading(false)
          SimpleToast.show(!isNullOrEmptyNOTTrim(responseResult?.message) ? responseResult?.message : translate('Something_went_wrong'));
        }
      } catch (error) {
        setTimeout(() => {
          setLoading(false)
        }, 1000);
      }
    } else {
      SimpleToast.show(translate('no_internet_conneccted'))
    }
  }

  const cropDiagDATA = [
    {
      name: "Go_to_Farm",
      id: 1,
      image: require('../../assets/Images/cropOne.png'),
      textColor: "rgba(52, 136, 250, 1)"
    },
    {
      name: "Click_Photo",
      id: 2,
      image: require('../../assets/Images/cropTwo.png'),
      textColor: "rgba(8, 128, 180, 1)"
    },
    {
      name: "Find_Disease",
      id: 3,
      image: require('../../assets/Images/cropThree.png'),
      textColor: "rgba(70, 140, 0, 1)"
    },
  ];

  const CarouselDATA = [
    {
      name: translate('titleOne'),
      desc: translate('Desc_one'),
      id: 1,
    },
    {
      name: translate('titleTwo'),
      desc: translate('Desc_two'),
      id: 2,
    },
  ];

  const openCameraProfilePic = async () => {
    setShowSelectionModal(false)
    try {
      var image = await ImagePicker.openCamera({
        cropping: false,
        includeBase64: false,
        compressImageQuality: 1.0,
        mediaType: 'photo'
      })
      var response = await ImageResizer.createResizedImage(image.path, 900, 900, "JPEG", 80, 0, null)
      setImageData(response)
      setFromGallery(false)
      setCameraRelatedPopUp(true)
    } catch (err) {
      console.error(err)
    }
  }

  const submitCrop = async () => {
    if (isConnected) {
      try {
        setLoading(false)
        setCropLoading(true)
        setLoadingMessage(translate('Detecting_Problem'))
        var cropDiseaseNotificationUrl = ApiConfig.BASE_URL_NVM + ApiConfig.CROPDIAGNOSTICS.CROPDISEASEIDENTIFICATION;
        const jsonData = {
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        };

        const formData = new FormData();
        const fileExtension = ImageData.name.split('.').pop().toLowerCase();

        const mimeTypeMap = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          webp: 'image/webp',
          gif: 'image/gif',
          bmp: 'image/bmp',
        };
        const mimeType = mimeTypeMap[fileExtension] || 'image/jpeg';
        console.log("📸 multipartFileBeforeAppend:", {
          uri: ImageData.uri,
          type: mimeType,
          name: ImageData.name
        });

        if (ImageData != undefined && ImageData != "" && ImageData != "") {
          console.log('ImageDataInformdata', ImageData)
          formData.append('file',
            {
              uri: ImageData.uri,
              type: mimeType,
              name: ImageData.name
            });
        } else {
          formData.append('file', "");
        }
        formData.append('jsonData', JSON.stringify(jsonData));
        console.log("FormData:", JSON.stringify(formData));
        const finalResponse = await ApiService.post(cropDiseaseNotificationUrl, formData, null, true)
        console.log("finalResponse", JSON.stringify(finalResponse))
        if (finalResponse.statusCode === STATUS_CODE_SUCCESS_200) {
          const dashboardRespBYPASS = finalResponse.response
          setCropLoading(false)
          navigation.navigate("CropDesiesDetection", { data: dashboardRespBYPASS })
        } else {
          setCropLoading(false)
          setLoadingMessage("")
        }
      }
      catch (error) {
        setTimeout(() => {
          setLoading(false)
          setCropLoading(false)
        }, 100);
      }
    } else {
      SimpleToast.show(translate('no_internet_conneccted'))
    }
  }


  const openImagePickerProfilePic = async () => {
    setShowSelectionModal(false)
    try {
      var image = await ImagePicker.openPicker({
        cropping: false,
        includeBase64: false,
        compressImageQuality: 1.0,
        mediaType: 'photo'
      })
      var response = await ImageResizer.createResizedImage(image.path, 900, 900, "JPEG", 80, 0, null)
      setImageData(response)
      setCameraRelatedPopUp(true)
      setFromGallery(true)
    } catch (err) {
      console.error(err)
    }
  }

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('dontShowThisAgain', JSON.stringify(value));
      setCameraRelatedPopUp(false)
      openCameraProfilePic()
    } catch (e) {
      console.error(e)
    }
  };

  const checkData = async () => {
    try {
      const result = await AsyncStorage.getItem('dontShowThisAgain');
      return JSON.parse(result);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const renderCropDiagnosticsList = ({ item }) => {
    return (
      <View key={item.id} style={styles.eachCropDiagnosticsItemContainer}>
        <Image source={item.image} style={styles.eachCropDiagnosticsImage} />
        <Text style={[{ color: item.textColor }, styles.eachCropDiagnosticsText]}>{translate(item.name)}</Text>
      </View>
    )
  }

  const renderCropDiagnosticsHistoryList = ({ item }) => {
    return (
      <View style={styles.cropDiagnosticsHistoryListContainer}>
        <View style={styles.cropDiagnosticsHistoryListSubContainer}>
          <View style={styles.diseasesDetectedContainer}>
            <Image tintColor={"#ED3237"} source={require('../../assets/Images/diseaseDetected.png')} style={styles.diseaseDetectedIcon} />
            <Text style={styles.diseasesDetectedTitle}>{item.cropDiseaseTitle != undefined ? item.cropDiseaseTitle : translate('No_Disease_Detected')}</Text>
          </View>
          <View style={styles.diseasesDetectedDetailsContainer}>
            <View style={styles.diseasesDetectedDetailsSubContainer}>
              <Image source={item?.imageUrl ? { uri: item.imageUrl } : require('../../assets/Images/image_not_exist.png')} style={styles.diseasesDetectedImg} />
              <View>
                <Text style={styles.diseasesDetectedDiseasesName}>{item?.diseaseName || ''}</Text>
                <Text style={styles.diseasesCropName}>{item?.cropName || ''}</Text>
                <Text style={styles.diseasesDetectedCreatedOnText}>{item?.createdOn?.split('T')[0] || ''}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.diseasesDetectedViewBtnContainer} onPress={() => navigation.navigate("CropDesiesDetection", { data: item })}>
            <Text style={styles.viewDetailsText}>{translate("View_Details")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }



  const handleBackScreen = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("HomeScreen");
    }
  };

  return (
    <>
      <CustomHeaders backBtnHandle={handleBackScreen} headersTitle={translate("Crop_Diagnostic_Tool")} />
      <View style={styles.tabsContainer}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => setSelectedFilter(translate('Crop_Diagnostic'))} style={[selectedFilter === translate('Crop_Diagnostic') && { backgroundColor: "#ED3237" }, styles.tabSubContainer]}>
          <Text style={[{ color: selectedFilter === translate('Crop_Diagnostic') ? "#fff" : "#000" }, styles.tabText]}>{translate('Crop_Diagnostic')}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => {
          setSelectedFilter(translate('history'));
        }} style={[selectedFilter === translate('history') && { backgroundColor: "#ED3237" }, styles.tabSubContainer]}>
          <Text style={[{ color: selectedFilter === translate('history') ? "#fff" : "#000" }, styles.tabText]}>{translate('history')}</Text>
        </TouchableOpacity>
      </View>
      {
        selectedFilter === translate('Crop_Diagnostic') &&
        <View style={styles.cropDiagnosticsMainContainer}>
          <FlatList
            data={cropDiagDATA}
            ListFooterComponent={
              <>
                <View style={styles.listFooterContainer}>
                  <CustomButton
                    btnText={translate("Take_a_Picture")}
                    btnWidth={"100%"}
                    btnHeight={45}
                    btnRadius={6}
                    btnColor={Colors.app_theme_color}
                    textColor={Colors.white_color}
                    borderColor={Colors.app_theme_color}
                    borderWidth={0.5}
                    fontSize={14}
                    marginTop={10}
                    onPress={() => setShowSelectionModal(true)}
                  />
                </View>
                <View style={{ height: 50 }} />
              </>
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<>
              <View style={styles.noDataAvailableTextContainer}>
                <Text style={styles.noDataText}>
                  {translate('No_data_available')}
                </Text>
              </View>
            </>}
            renderItem={renderCropDiagnosticsList}
            keyExtractor={item => item.id}
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={cameraRelatedPopUp}
          >
            <View style={styles.overallContainer}>
              <TouchableWithoutFeedback>
                {ImageData !== null
                  ?
                  <View style={styles.subContainer}>
                    <Image source={{ uri: ImageData?.uri }} style={styles.imageData} />
                    <View style={[styles.container]}>
                      <TouchableOpacity onPress={() => {
                        if (fromGallery) {
                          openImagePickerProfilePic()
                        }
                        else { openCameraProfilePic() }
                      }} style={[styles.button, styles.clearButton, { borderColor: "#ED3237" }]}>
                        <Text style={[styles.buttonText, { color: "#ED3237" }]}>{fromGallery ? translate("ReSelect") : translate('Re-Take')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        submitCrop()
                        setCameraRelatedPopUp(false)
                      }} style={[styles.button, { borderColor: "#ED3237", backgroundColor: "#ED3237", }]}>
                        <Text style={[styles.buttonText, { color: "#fff" }]}>{translate('proceed')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  :
                  <View style={[styles.subContainer]}>
                    <TouchableOpacity onPress={() => { storeData(true) }} style={styles.dontShowAgainBtnContainer}>
                      <Text style={styles.dontShowAgainText}>{translate('Dont_show_this_again')}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                      <Image style={styles.cameraPopupIcon} source={require('../../assets/Images/cameraPopup.png')} />
                      <Text style={styles.carouselNameText}>{CarouselDATA[carouselIndex].name}</Text>
                      <Text style={styles.carouselDesText}>{CarouselDATA[carouselIndex].desc}</Text>

                      <View style={styles.lineDividerContainer}>
                        <View style={[carouselIndex === 0 ? styles.lineDividerOne : styles.lineDividerOneCopy]} />
                        <View style={[carouselIndex === 1 ? styles.lineDividerTwo : styles.lineDividerTwoCopy]} />
                      </View>
                    </View>
                    <View style={styles.container}>
                      <TouchableOpacity onPress={() => {
                        setCarouselIndex(1)
                        openCameraProfilePic()
                      }} style={[styles.button, styles.clearButton, { borderColor: "#ED3237" }]}>
                        <Text style={[styles.buttonText, { color: "#ED3237" }]}>{translate('skip')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        if (carouselIndex === 0) {
                          setCarouselIndex(carouselIndex + 1)
                        } else {
                          openCameraProfilePic()
                        }
                      }} style={[styles.button, { borderColor: "#ED3237", backgroundColor: "#ED3237", }]}>
                        <Text style={[styles.buttonText, { color: "#fff" }]}>{translate('Next')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                }
              </TouchableWithoutFeedback>
            </View>
          </Modal>
        </View>
      }
      <CustomGalleryPopup
        showOrNot={showSelectionModal}
        onPressingOut={() => setShowSelectionModal(false)}
        onPressingCamera={async () => {
          if (await checkData()) {
            openCameraProfilePic()
          } else {
            setCameraRelatedPopUp(true), setShowSelectionModal(false), setImageData(null), setCarouselIndex(0)
          }
        }}
        onPressingGallery={() => { setImageData(null), openImagePickerProfilePic() }}
      />

      {
        selectedFilter === translate('history') &&
        <View style={styles.cropDiagnosticsMainContainer}>
          {diseases.length > 0 ? (
            <FlatList
              data={diseases}
              ListFooterComponent={<View style={{ height: 50 }} />}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<>
                <View style={styles.noDataAvailableTextContainer}>
                  <Text style={styles.noDataText}>
                    {translate('No_data_available')}
                  </Text>
                </View>
              </>}
              renderItem={renderCropDiagnosticsHistoryList}
              keyExtractor={(item, index) => item?.id?.toString() || `index-${index}`}
            />
          ) : (
            <View style={styles.noDataAvaiableHistoryContainer}>
              <Text style={styles.noDataAvailableHistoryText}>{translate('No_data_available')}</Text>
            </View>
          )}
        </View>
      }
      {loading && <CustomLoader visible={loading} />}
      {cropLoading && <CustomDiagnosticsLoader loading={cropLoading} message={loadingMessage} loaderImage={require("../../assets/Images/plant_animation.gif")} />}
    </>

  );
};

export default CropDiagnosticsScreen;
