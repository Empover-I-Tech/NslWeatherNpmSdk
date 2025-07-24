import { Platform, Text, StatusBar, View, FlatList, Image, TouchableOpacity, Dimensions, Modal, TouchableWithoutFeedback, SafeAreaView, PermissionsAndroid, Alert, Linking } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../Localization/Localisation';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import SimpleToast from 'react-native-simple-toast';
import styles from './styles';
import CustomLoader from '../../components/CustomLoader';
import CustomCircularProgress from '../../components/CustomCircularProgress';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import { CONFIG_KEYS, configs_nvm, MAP_MY_INDIA_URL, STATUS_CODE_SUCCESS_200 } from '../../Networks/ApiConfig';
import ApiService from '../../Networks/ApiService';
import { getFromAsyncStorage, isNullOrEmptyNOTTrim, MOBILENUMBER, USER_ID } from '../../Utility/Utils';
import { useColors } from '../../colors/Colors';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';


const WeatherScreen = ({ route }) => {
  console.log("routechecking=-=->", route?.params?.itemData)
  const Colors = useColors()
  const navigation = useNavigation()
  const [loader, setLoader] = useState(false)
  const FILTERS = [translate("Days_Forecast_15"), translate("Hourly")]
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [forecastData, setForecastData] = useState(null)
  const [selectedWeather, setSelectedWeather] = useState('');
  const [hourlyData, setHourlyData] = useState(null)
  const [cropList, setCropList] = useState(null)
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [selectedDatePest, setSelectedDatePest] = useState(translate("Select_Date"));
  const [pestForecastData, setPestForecastData] = useState(null)
  const [fallBackTest, setFallBackTest] = useState("")
  const [showDropDowns, setShowDropDowns] = useState(false)
  const [cityDet, setCityDet] = useState(null)
  const [currentTime, setCurrentTime] = useState(moment().format("LT"));
  const { width, height } = Dimensions.get("window")
  const { isConnected } = useSelector(state => state.network);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCropId, setSelectedCropId] = useState(null)
  const [rawDate, setRawDate] = useState("")

  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [coordinates, setCoordinates] = useState('')
  const [mapZoomingLevel, setMapZoomingLevel] = useState(0)
  console.log("checkinZoominLevel=-=-=>", mapZoomingLevel)
  console.log("selectedFilter-=-=->", selectedFilter)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format("LT"));
    }, 100);
    return () => clearInterval(interval);

  }, []);

  useEffect(() => {
    if (route?.params?.backScreen) {
      getWeatherData(route?.params?.backScreen?.latitude, route?.params?.backScreen?.longitude)
      getDetailsDashBoardData(route?.params?.backScreen?.latitude, route?.params?.backScreen?.longitude)
      console.log("route?.params?.backScreen=-=-=>", route?.params?.backScreen)
      setLatitude(route?.params?.backScreen?.latitude)
      setLongitude(route?.params?.backScreen?.longitude)
      setSelectedCrop(null)
      setSelectedDatePest(translate("Select_Date"))
      setPestForecastData(null)
      setRawDate("")
      setMapZoomingLevel(route?.params?.backScreen?.zoom)
    }

  }, [route?.params?.backScreen])
  console.log("checki=-=-=-=-Latitude", latitude, longitude)

  useEffect(() => {
    if (route?.params?.itemData?.enablePestForecast) {
      console.log("aqqqwpwopo>>>", route?.params?.itemData?.enablePestForecast)
      getDetailsDashBoardData(route?.params?.itemData?.coord?.lat, route?.params?.itemData?.coord?.lon)
      setLatitude(route?.params?.itemData?.coord?.lat)
      setLongitude(route?.params?.itemData?.coord?.lon)
      setTimeout(()=>{
        getWeatherData(route?.params?.itemData?.coord?.lat, route?.params?.itemData?.coord?.lon)
      },500)
      setSelectedCrop(null)
      setSelectedDatePest(translate("Select_Date"))
      setPestForecastData(null)
      setRawDate("")
      setMapZoomingLevel(30)
      setSelectedFilter(translate('PestForecast'))
    } else if (route?.params?.itemData) {
      getDetailsDashBoardData(route?.params?.itemData?.coord?.lat, route?.params?.itemData?.coord?.lon)
      setLatitude(route?.params?.itemData?.coord?.lat)
      setLongitude(route?.params?.itemData?.coord?.lon)
      setTimeout(()=>{
      getWeatherData(route?.params?.itemData?.coord?.lat, route?.params?.itemData?.coord?.lon)
      },500)
      setSelectedCrop(null)
      setSelectedDatePest(translate("Select_Date"))
      setPestForecastData(null)
      setRawDate("")
      setMapZoomingLevel(30)
    }
  }, [route?.params?.itemData])



  const getDetailsDashBoardData = async (latitude, longitude) => {
    const url = MAP_MY_INDIA_URL;
    try {
      let urll = `${url}?lat=${latitude}&lng=${longitude}`
      const response = await ApiService.get(urll)
      console.log("RAW RESPONSE FROM API ===>", response);
      if (response?.results?.length > 0) {
        const { pincode, state, district, poi, subDistrict, village, formatted_address, locality, subLocality } = response.results[0];
        getCropsList(latitude, longitude, state)
        return { pincode, state, district, poi, subDistrict, village, formatted_address, locality, subLocality };

      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching reverse geocode data:', error.message);
      return null;
    }
  }

  const getWeatherData = async (newLat, newLong) => {
    const url = configs_nvm.BASE_URL_NVM + CONFIG_KEYS.WEATHERDETAILS.nslgetWeatherDetailsV1
    if (isConnected) {
     setTimeout(() => {
        setLoader(true)
      }, 500)
    try {
      const body = {
        latitude: newLat,
        longitude: newLong,
        mobileNumber: await getFromAsyncStorage(MOBILENUMBER),
        userId: await getFromAsyncStorage(USER_ID),
      };
      const finalResponse = await ApiService.post(url, body, false);
      if (finalResponse.statusCode == "200" || finalResponse.statusCode == STATUS_CODE_SUCCESS_200) {
        setTimeout(async () => {
          setForecastData(finalResponse.response.dailyBaseWeatherInfo);
          setHourlyData(finalResponse.response.hourlyBaseWeatherInfo);
          let res = await getDetailsFromLatlong(newLat, newLong);
          setCityDet(res);
          setTimeout(() => {
            setLoader(false);
          }, 1000)
        }, 100);
      } else {
        setTimeout(() => {
          setLoader(false);
        }, 1000)
        SimpleToast.show(
          !isNullOrEmptyNOTTrim(finalResponse?.message)
            ? finalResponse?.message
            : translate('Something_went_wrong')
        );
      }
    } catch (error) {
      setTimeout(() => {
          setLoader(false);
        }, 500)
      console.error('Error in getWeatherData:', error);
      SimpleToast.show(translate('Something_went_wrong'));
    } finally {
      setTimeout(()=>{
      setLoader(false);
      },500)
    }
  } else {
    setTimeout(() => {
      setLoader(false);
    }, 500)
    SimpleToast.show(translate("no_internet_connected"));
  }
};



  let todayForecast = forecastData?.forecast?.filter((data) => {
    return data?.day === 'Today'
  })

  let otherDaysForecast = forecastData?.forecast?.filter((data) => {
    return data?.day !== 'Today'
  })

  const getSections = (data) => {
    if (!data) return [];
    const mergedData = data.reduce((acc, dayData) => {
      return { ...acc, ...dayData };
    }, {});
    return Object.keys(mergedData)?.map((dayTitle) => ({
      title: dayTitle,
      data: mergedData[dayTitle],
    }));
  };

  const hourlyDataArr = getSections(hourlyData);

  const getDiseasesFromMap = async (date) => {
    setLoader(true)
    const pestUrlInfo = configs_nvm.BASE_URL_NVM + CONFIG_KEYS.WEATHERDETAILS.getPestInformation
    const payload = {
      "latitude": latitude,
      "longitude": longitude,
      "crop": selectedCrop,
      "sowingDate": date,
      "state": cityDet?.state
    }
    const finalResponse = await ApiService.post(pestUrlInfo, payload)
    if (isConnected) {
      try {
      if(finalResponse){
          setTimeout(() => {
          setLoader(false);
        }, 500)
        if (finalResponse?.response?.pestForecast.length > 0) {
          let pestForecastList = finalResponse.response.pestForecast
          setPestForecastData(pestForecastList)
            setTimeout(() => {
              setLoader(false);
            }, 1000)
        } else {
          setFallBackTest(finalResponse?.message || translate("No_pests_detected_moment_later"))
          setPestForecastData(null)
          setTimeout(() => {
            setLoader(false);
          }, 1000)
          SimpleToast.show(!isNullOrEmptyNOTTrim(finalResponse?.message) ? finalResponse?.message : translate('Something_went_wrong'));
        }
      }
      } catch (erro) {
            setTimeout(() => {
            setLoader(false);
          }, 500)
      }
      finally{
        setTimeout(() => {
          setLoader(false)
        }, 500)
      }
    } else {
          setTimeout(() => {
            setLoader(false);
          }, 500)
      SimpleToast.show(translate('no_internet_conneccted'))
    }
  }

  const getDetailsFromLatlong = async (latitude, longitude) => {
    const url = MAP_MY_INDIA_URL;
    try {
      let urll = `${url}?lat=${latitude}&lng=${longitude}`
      const response = await ApiService.get(urll)
      if (response.results) {
        const { pincode, state, district, poi, subDistrict, village, formatted_address, locality, subLocality } = response.results[0];
        return { pincode, state, district, poi, subDistrict, village, formatted_address, locality, subLocality };
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  const getCropsList = async (latitude, longitude, state) => {
    if (isConnected) {
      try {
        setLoader(false)
        var url = configs_nvm.BASE_URL_NVM + CONFIG_KEYS.WEATHERDETAILS.getPestForecastCrops
        const payload = { "latitude": latitude, "longitude": longitude, "state": state }
        const finalResponse = await ApiService.post(url, payload, false)
        console.log("masterResp", JSON.stringify(finalResponse))
        if (finalResponse?.statusCode == 200) {
          var masterResp = finalResponse?.response?.pestForecastCropsList
          setCropList(masterResp)
          setFallBackTest("")
        } else {
          SimpleToast.show(!isNullOrEmptyNOTTrim(finalResponse?.message) ? finalResponse?.message : translate('Something_went_wrong'));
        }
      }
      catch (error) {
        setTimeout(() => {
          setLoader(false)
        }, 2000);
        SimpleToast.show(error.message)
      }
    } else {
      SimpleToast.show(translate('no_internet_conneccted'))
    }
  }

  const handleDateModal = () => {
    if (selectedCrop) {
      setCalendarVisible(true)
    } else {
      SimpleToast.show(translate("Please_Select_Crop"))
    }
  }

  const fetchLocation = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
              //       Alert.alert(
              //   'Location Permission Required',
              //   'Please allow location access in settings to use this feature.',
              //   [
              //     { text: 'Cancel', style: 'cancel' },
              //     { text: 'Open Settings', onPress: () => Linking.openSettings() },
              //   ]
              // );
      SimpleToast.show(translate('location_error'));
      // await requestLocationPermission()
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        // dispatch(setLocationActions({ latitude, longitude }));
        setLatitude(latitude);
        setLongitude(longitude);
      },
      error => {
        if (error.code === 3 || error.code === 2) {
          // Retry with higher accuracy
          Geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              setLatitude(latitude);
              setLongitude(longitude);
            },
            fallbackError => {
              console.error('Fallback location error:', fallbackError);
            },
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
          );
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 5000 }
    );
  }, []);

  const callLocationNavigation = async () => {
    if (isConnected) {
      const hasPermission = await requestLocationPermission();
      if (hasPermission === 'granted') {
        if (Platform.OS == "android") {
          const isGpsEnabled = await checkIfGpsEnabled();
          if (isGpsEnabled) {
            // LocationNavigation()
            // navigation.navigate('Location', { screeName: "WeatherScreen", address: cityDet, coordinates: { latitude, longitude } })
            navigation.navigate('Location', { coordinates: { latitude: latitude, longitude: longitude, address: cityDet, screenName: "WeatherScreen", zoom: mapZoomingLevel } })

          }
          else {
            console.log('ehehehehe F2')
            fetchLocation()
            // navigation.navigate('Location', { screeName: "WeatherScreen", address: cityDet, coordinates: { latitude, longitude } })

          }
        }
        else {
          navigation.navigate('Location', { coordinates: { latitude: latitude, longitude: longitude, address: cityDet, screenName: "WeatherScreen", zoom: mapZoomingLevel } })
        }
      }else{
        // console.log('ehehehehe F1')
        fetchLocation()
      }
    } else {
      SimpleToast.show(translate('no_internet_conneccted'));
    }
  }
  console.log("checkingZoomongLevel=-=->", mapZoomingLevel)

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        const fine = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
        const coarse = granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];
 
        if (
          fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
          coarse === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          Alert.alert(
            translate("permission_required"),
            translate("permission_permantely_den"),
            [
              { text: translate("cancel"), style: 'cancel' },
              { text: translate("open_settings"), onPress: () => Linking.openSettings() },
            ]
          );
          return 'never_ask_again';
        }
 
        if (
          fine === PermissionsAndroid.RESULTS.DENIED ||
          coarse === PermissionsAndroid.RESULTS.DENIED
        ) {
          Alert.alert(
            translate("permission_required"),
            translate("permission_permantely_den"),
            [
              { text: translate("cancel"), style: 'cancel' },
              { text: translate("open_settings"), onPress: () => Linking.openSettings() },
            ]
          );
          return 'denied';
        }
 
        if (
          fine === PermissionsAndroid.RESULTS.GRANTED &&
          coarse === PermissionsAndroid.RESULTS.GRANTED
        ) {
          return 'granted';
        }
 
        return 'unknown';
      } catch (error) {
        console.warn('Android location permission error:', error);
        return 'error';
      }
    } else if (Platform.OS === 'ios') {
      try {
        const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
 
        if (status === RESULTS.GRANTED) {
          return 'granted';
        }
 
        if (status === RESULTS.DENIED) {
          const requestStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          if (requestStatus === RESULTS.GRANTED) {
            return 'granted';
          } else if (requestStatus === RESULTS.BLOCKED) {
             Alert.alert(
            translate("permission_required"),
            translate("permission_permantely_den"),
            [
              { text: translate("cancel"), style: 'cancel' },
              { text: translate("open_settings"), onPress: () => Linking.openSettings() },
            ]
          );
            return 'blocked';
          } else {
           Alert.alert(
            translate("permission_required"),
            translate("permission_permantely_den"),
            [
              { text: translate("cancel"), style: 'cancel' },
              { text: translate("open_settings"), onPress: () => Linking.openSettings() },
            ]
          );
            return 'denied';
          }
        }
 
        if (status === RESULTS.BLOCKED) {
          Alert.alert(
            translate("permission_required"),
            translate("permissionBlocked"),
            [
              { text: translate("cancel"), style: 'cancel' },
              { text: translate("open_settings"), onPress: () => openSettings() },
            ]
          );
          return 'blocked';
        }
 
        if (status === RESULTS.UNAVAILABLE) {
          Alert.alert(
            translate("Not_Available"),
            translate("permissionNotAvailable"),
            [{ text: translate("ok") }]
          );
          return 'unavailable';
        }
 
        return 'unknown';
      } catch (error) {
        console.warn('iOS location permission error:', error);
        return 'error';
      }
    }
  };

  const checkIfGpsEnabled = useCallback(async () => {
    try {
      await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 20000,
        fastInterval: 6000,
      });
      return true;
    } catch (err) {
      return false;
    }
  }, []);



  const closeDate = () => {
    setCalendarVisible(false)
  }

  const handleRemedy = (item) => {
    navigation.navigate('Remedyrecommendation', { data: item, cropName: selectedCrop, latitude, longitude })
  }

  const onPressDropdownItem = (item) => {
    setSelectedCrop(item.name)
    setSelectedCropId(item.id)
    setShowDropDowns(false)
    setPestForecastData(null)
    setLoader(false)
    setFallBackTest("")
    setSelectedDatePest(translate("Select_Date"))
  }

  const handleBackScreen = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("HomeScreen");
    }
  };

  return (
      <View style={styles.mainContainer}>
      <SafeAreaView style={[styles.weatherSafeAreaContainer, { backgroundColor: Colors.app_theme_color }]}>
        {Platform.OS === 'android' && <StatusBar backgroundColor={Colors.app_theme_color} barStyle={"light-content"} />}
        <View style={[styles.mainHeadersContainer, { backgroundColor: Colors.app_theme_color }]}>
          <View style={styles.mainSubHeadersContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackScreen}>
              <Image source={require("../../assets/Images/ScreenBackIcon.png")} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: Colors.secondaryColor , fontFamily : global.fontStyles.Bold}]}>
              {translate("weather")}
            </Text>
          </View>
        </View>
        </SafeAreaView>

        {selectedFilter === translate("Days_Forecast_15") && forecastData &&
          <View style={[styles.weatherInfoCard]}>
            <View style={[styles.locationTimeContainer, { marginBottom: 0, }]}>

              <View style={[styles.locationContainer, { flexDirection: "column", alignItems: "center", }]}>
                <Text style={[styles.tempText, styles.tempText2,{fontFamily : global.fontStyles.Regular}]}>
                  {todayForecast[0]?.displayDay || '--'}
                </Text>
                <Text style={[styles.rangeText,{fontFamily : global.fontStyles.Regular}]}>
                  {todayForecast[0]?.date || '--'}
                </Text>
              </View>

              <TouchableOpacity onPress={() => { callLocationNavigation() }}
                style={[styles.locationContainer, { marginTop: -responsiveHeight(4) }]}>
                <Image source={require("../../assets/Images/locationImgIcon.png")} style={styles.locationIcon} />
                <Text style={[styles.locationText, { color: Colors.textColor, fontFamily : global.fontStyles.SemiBold }]}>
                  {(todayForecast[0]?.city) || '--'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weatherDetails}>
              <View style={styles.weatherDescriptionContainer}>
                <Image source={{ uri: todayForecast[0]?.image }} style={styles.weatherTodayForecastImg} />

                <View style={styles.weatherDescription}>

                  <Text style={[styles.weatherDescText, { color: Colors.yellow_rgba, fontFamily : global.fontStyles.SemiBold, minWidth: "80%", fontSize: 15 }]}>
                    {todayForecast[0]?.weather_description || "--"}
                  </Text>

                  {todayForecast[0]?.max_temp ?
                    <View style={styles.todayForecastMaxTempContainer}>
                      <Text style={[styles.tempText, { color: Colors.textColor, fontSize: 34 , fontFamily : global.fontStyles.Regular}]}>
                        {Math.round(todayForecast[0]?.max_temp)}
                      </Text>
                      <Text style={[styles.degreeText, { color: Colors.textColor, marginTop: -3, fontFamily : global.fontStyles.Regular }]}>{"°c"}</Text>
                    </View> : <Text style={[styles.tempText, { color: Colors.textColor }]}>
                      {'--'}
                    </Text>
                  }

                  <View style={styles.tempRange}>
                    {todayForecast[0]?.max_temp ?
                      <View style={styles.todaysWeatherContainer}>
                        <Text style={[styles.rangeText, { color: Colors.lightish_grey, fontFamily : global.fontStyles.Regular }]}>
                          {`${translate('high')} ${Math.round(todayForecast[0]?.max_temp)}`}
                        </Text>
                        <Text style={[styles.degree2Text, { color: Colors.lightish_grey,fontFamily : global.fontStyles.Regular }]}>{"°"}</Text>
                      </View> :

                      <Text style={[styles.tempText, { color: Colors.lightish_grey }]}>
                        {'--'}
                      </Text>}
                    <View style={styles.divider} />
                    {todayForecast[0]?.min_temp ?
                      <View style={styles.todaysWeatherContainer2}>
                        <Text style={[styles.rangeText, { color: Colors.lightish_grey, fontFamily : global.fontStyles.Regular }]}>
                          {`${translate('low')} ${Math.round(todayForecast[0]?.min_temp)}`}
                        </Text>
                        <Text style={[styles.degree2Text, { color: Colors.lightish_grey , fontFamily : global.fontStyles.Regular}]}>{"°"}</Text>
                      </View> :

                      <Text style={[styles.tempText, { color: Colors.lightish_grey }]}>
                        {'--'}
                      </Text>}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.weatherStats}>
              <View style={styles.weatherStatItem}>
                <Image source={require('../../assets/Images/forceRain.png')} style={styles.weatherStatIcon} />
                <Text style={[styles.weatherStatText, { color: Colors.textColor,fontFamily : global.fontStyles.SemiBold }]}>
                  {todayForecast[0]?.speed ? `${todayForecast[0]?.speed}/h` : '--'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.weatherStatItem}>
                <Image source={require('../../assets/Images/dropIcon.png')} style={styles.weatherStatIcon} />
                <Text style={[styles.weatherStatText, { color: Colors.textColor , fontFamily : global.fontStyles.SemiBold }]}>
                  {todayForecast[0]?.humidity ? `${todayForecast[0]?.humidity}%` : '--'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.weatherStatItem}>
                <Image source={require('../../assets/Images/cloud.png')} style={styles.weatherStatIcon} />
                <Text style={[styles.weatherStatText, { color: Colors.textColor, fontFamily : global.fontStyles.SemiBold }]}>
                  {todayForecast[0]?.rain !== undefined ? `${todayForecast[0]?.rain}%` : '--'}
                </Text>
              </View>
            </View>
          </View>
        }

        <View style={[styles.tabsMainContainer, { marginTop: selectedFilter !== translate("Days_Forecast_15") ? 15 : 5 }]}>

          <TouchableOpacity onPress={() => {
            setSelectedFilter(translate("Days_Forecast_15"))
            setSelectedWeather('')
          }} activeOpacity={0.5} style={[selectedFilter === translate("Days_Forecast_15") ? {
            backgroundColor: Colors.app_theme_color,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center"
          } : {
            borderWidth: 1,
            borderColor: Colors.app_theme_color,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
          }, { width: "25%", height: 30 }]}>
            <Text style={[styles.tabText, { color: selectedFilter === translate("Days_Forecast_15") ? Colors.secondaryColor : Colors.app_theme_color, fontFamily : global.fontStyles.Regular }]}>{translate("Days_Forecast_15")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setSelectedFilter(translate("Hourly"))
            if (hourlyDataArr) {
              setSelectedWeather(hourlyDataArr[0])
            }
          }} activeOpacity={0.5} style={[
            selectedFilter === translate("Hourly") ? {
              backgroundColor: Colors.app_theme_color,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center"
            } : {
              borderWidth: 1,
              borderColor: Colors.app_theme_color,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
            }, { width: "25%", height: 30, marginHorizontal: 5 }]}>
            <Text style={[styles.tabText, { color: selectedFilter === translate("Hourly") ? Colors.secondaryColor : Colors.app_theme_color, fontFamily : global.fontStyles.Regular }]}>3 {translate("Hourly")}</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => {
            setSelectedFilter(translate('PestForecast'))
            if (hourlyDataArr) {
              // alert(JSON.stringify(hourlyDataArr[0]))
              setSelectedWeather(hourlyDataArr[0])
            }
          }} activeOpacity={0.5} style={[
            selectedFilter === translate('PestForecast') ? {
              backgroundColor: Colors.app_theme_color,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center"
            } : {
              borderWidth: 1,
              borderColor: Colors.app_theme_color,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
            }, { width: "25%", height: 30, }]}>
            <Text style={[styles.tabText, { color: selectedFilter === translate('PestForecast') ? Colors.secondaryColor : Colors.app_theme_color,fontFamily : global.fontStyles.Regular }]}>{translate('PestForecast')}</Text>
          </TouchableOpacity>
        </View>

        {selectedFilter === translate('PestForecast') ?
          <View style={[styles.weatherInfoCard, styles.weatherInfOCard1]}>

            <View style={[styles.locationTimeContainer, { marginBottom: 0, }]}>
              <View style={[styles.locationContainer, { flexDirection: "column", alignItems: "center", }]}>
                <Text style={[styles.tempText, styles.locationDetailsText,{fontFamily : global.fontStyles.Regular }]}>
                  {translate("Location_Details")}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    callLocationNavigation()
                  }}
                  style={[styles.locationContainer]}>
                  <Image source={require("../../assets/Images/locationImgIcon.png")} style={styles.locationIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.weatherLineDivider} />
            <Text style={[styles.forecastTemp, { color: Colors.textColor, fontFamily : global.fontStyles.Regular, fontSize: 12 }]}>
              {translate("Showing_infestation_Forecast")}
            </Text>
            <View style={styles.locationDetailsMainContainer}>
              <View>
                <Text style={[styles.forecastTemp, styles.locationStateText,{fontFamily : global.fontStyles.Regular}]}>{translate("State")}</Text>
                <Text style={[styles.forecastTemp, styles.locationStateValueText,{fontFamily : global.fontStyles.SemiBold}]}>{cityDet?.state || '--'}</Text>
              </View>
              <View>
                <Text style={[styles.forecastTemp, styles.locationStateText,{fontFamily : global.fontStyles.Regular}]}>{translate("District")}</Text>
                <Text style={[styles.forecastTemp, styles.locationStateValueText,{fontFamily : global.fontStyles.SemiBold}]}>{cityDet?.district || '--'}</Text>
              </View>
              <View>
                <Text style={[styles.forecastTemp, styles.locationStateText,{fontFamily : global.fontStyles.Regular}]}>{translate("new_village")}</Text>
                <Text style={[styles.forecastTemp, styles.locationStateValueText,{fontFamily : global.fontStyles.SemiBold}]}>{cityDet?.village || cityDet?.locality || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.cropsLineDivider} />

            {cropList && cropList.length > 0 ? (
              <View style={styles.cropsListMaincontainer}>
                <View style={styles.calendarDropDownMainContainer}>
                  <Text style={[styles.sowingdateText,{fontFamily : global.fontStyles.SemiBold }]}>{translate("Crop")}</Text>
                  <TouchableOpacity onPress={() => setShowDropDowns(true)} style={[styles.textInputContainer, { borderColor: Colors.lightish_grey }]}>
                    <Text style={[styles.selectCropTextInput,{fontFamily : global.fontStyles.Regular}]}>{selectedCrop != undefined && selectedCrop != translate('select') ? selectedCrop : translate('select')}</Text>
                    <Image source={require('../../assets/Images/down_arow.png')} style={[styles.dropDownIcon, { tintColor: Colors.black_color }]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.calendarDropDownMainContainer}>
                  <Text style={[styles.sowingdateText,{fontFamily : global.fontStyles.SemiBold }]}>{translate("sowing_date")}</Text>
                  <TouchableOpacity onPress={handleDateModal} style={[styles.textInputContainer, { borderColor: Colors.lightish_grey }]}>
                    <Text style={[styles.selectCropTextInput,{fontFamily : global.fontStyles.Regular}]}>{selectedDatePest}</Text>
                    <Image source={require('../../assets/Images/calendarIcon.png')} style={[styles.dropDownIcon, { tintColor: Colors.textColor }]} />
                  </TouchableOpacity>
                </View>
              </View>) : (
              <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20, height: 60 }}>
                <Text style={{ fontFamily:global.fontStyles.SemiBold, fontSize: 16, color: Colors.black_color }}>
                  {isConnected ? translate('location_error') : translate('no_internet_connected')}
                </Text>
              </View>)}
            {(pestForecastData != null && pestForecastData.length) &&
              <View style={styles.pestDiseasesContainer}>
                <Text style={[styles.pestDiseasesText,{fontFamily : global.fontStyles.SemiBold}]}>{translate('PestDiseases')}</Text>
              </View>

            }
            <View style={styles.pestForecastDiseasesListMainContainer}>
              <View style={styles.pestForecastDiseasesListSubContainer}>
                <FlatList
                  data={pestForecastData}
                  ListEmptyComponent={() => <Text style={styles.peastEmptyText}>{fallBackTest}</Text>}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity onPress={() => handleRemedy(item)} style={[styles.pestItemContainer, pestForecastData.length - 1 !== index && { marginBottom: 10 }]}>

                        <Image style={styles.pestImg} source={{ uri: item?.imageUrl }} />
                        <View style={styles.peastDetailsLine} />

                        <View style={styles.pestTextDetailsContainer}>
                          <Text style={[styles.pestText,{fontFamily : global.fontStyles.SemiBold}]}>{item?.pests}</Text>
                          {item?.description && <Text style={[styles.pestDescription,{fontFamily : global.fontStyles.Regular}]}>{item?.description}</Text>}
                        </View>
                        <CustomCircularProgress
                          percentage={item?.percentage} radius={25} strokeWidth={6} percentageText={item?.percentage} level={item?.level}
                        />

                      </TouchableOpacity>
                    )
                  }}
                  keyExtractor={item => item.id}
                />
              </View>
            </View>
          </View>

          :
          <FlatList
            data={selectedFilter === translate("Days_Forecast_15") ? otherDaysForecast : hourlyDataArr}
            // keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{ height: 50 }} />}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, height: Dimensions.get('window').height - 200, justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{ fontFamily: global.fontStyles.SemiBold, fontSize: 16, color: Colors.black_color, textAlign: 'center', width: '90%' }}>{isConnected ? translate('location_error') : translate('no_internet_connected')}</Text>
              </View>
            )}
            renderItem={({ item }) => {
              return (
                JSON.stringify(selectedWeather) === JSON.stringify(item) ? <View
                  style={[styles.weatherInfoCard, { marginBottom: 5, marginTop: 5, padding: 10 }]}>
                  <View style={[styles.locationTimeContainer, { marginBottom: 0, }]}>

                    <View style={[styles.locationContainer, { flexDirection: "column", alignItems: "center", }]}>
                      <Text style={[styles.tempText, { color: Colors.textColor, marginHorizontal: 0, textAlign: "left", alignSelf: "flex-start",fontFamily : global.fontStyles.Regular }]}>
                        {selectedWeather?.data[0]?.displayDay}
                      </Text>
                      <Text style={[styles.rangeText,{fontFamily : global.fontStyles.Regular}]}>
                        {moment(selectedWeather?.data[0]?.dt_txt).format('DD-MMM-YYYY')}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <TouchableOpacity
                        onPress={() => {
                          callLocationNavigation()
                        }} style={styles.locationContainer}>
                        <Image source={require("../../assets/Images/locationImgIcon.png")} style={styles.locationIcon} />
                        <Text style={[styles.locationText, { color: Colors.textColor, fontFamily : global.fontStyles.SemiBold }]}>
                          {(selectedWeather?.data[0]?.city) || '--'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          if (selectedWeather) {
                            setSelectedWeather('')
                          } else {
                            setSelectedWeather(item)
                          }
                        }}
                        style={[{ backgroundColor: Colors.app_theme_color, borderRadius: 5, padding: 5, alignItems: "center", justifyContent: "center", marginLeft: 10 }]}>
                        <Image style={[{ height: 10, width: 10, tintColor: Colors.secondaryColor }]} resizeMode='contain' source={selectedWeather === item ? require('../../assets/Images/up_arrow.png') : require('../../assets/Images/down_arow.png')}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.weatherDetails}>
                    <View style={styles.weatherDescriptionContainer}>
                      <Image source={require("../../assets/Images/cloudeIconImg.png")} style={styles.cloudIcon} />


                      <View style={styles.weatherDescription}>
                        <Text style={[styles.weatherDescText, { color: Colors.yellow_rgba, fontFamily: "", fontFamily: global.fontStyles.Regular, minWidth: "80%", fontSize: 15 }]}>
                          {selectedWeather?.data[0]?.weather_description || "--"}
                        </Text>


                        {selectedWeather?.data[0]?.max_temp ?
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={[styles.tempText, { color: Colors.textColor, fontSize: 34 ,fontFamily : global.fontStyles.Regular }]}>
                              {Math.round(selectedWeather?.data[0]?.max_temp)}
                            </Text>
                            <Text style={[styles.degreeText, { color: Colors.textColor, marginTop: -3,fontFamily : global.fontStyles.Regular  }]}>{"°c"}</Text>
                          </View> : <Text style={[styles.tempText, { color: Colors.textColor }]}>
                            {'--'}
                          </Text>}

                        <View style={styles.tempRange}>
                          {selectedWeather?.data[0]?.max_temp ?
                            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 5 }}>
                              <Text style={[styles.rangeText, { color: Colors.lightish_grey,fontFamily : global.fontStyles.Regular }]}>
                                {`${translate('high')} ${Math.round(selectedWeather?.data[0]?.max_temp)}`}
                              </Text>
                              <Text style={[styles.degree2Text, { color: Colors.lightish_grey, fontFamily : global.fontStyles.Regular }]}>{"°"}</Text>
                            </View> :

                            <Text style={[styles.tempText, { color: Colors.lightish_grey }]}>
                              {'--'}
                            </Text>}
                          <View style={styles.divider} />
                          {selectedWeather?.data[0]?.min_temp ?
                            <View style={{ flexDirection: "row", alignItems: 'center', marginLeft: 5 }}>
                              <Text style={[styles.rangeText, { color: Colors.lightish_grey,fontFamily : global.fontStyles.Regular }]}>
                                {`${translate('low')} ${Math.round(selectedWeather?.data[0]?.min_temp)}`}
                              </Text>
                              <Text style={[styles.degree2Text, { color: Colors.lightish_grey , fontFamily : global.fontStyles.Regular }]}>{"°"}</Text>
                            </View> :

                            <Text style={[styles.tempText, { color: Colors.lightish_grey }]}>
                              {'--'}
                            </Text>}
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.weatherStats}>
                    <View style={styles.weatherStatItem}>
                      <Image source={require('../../assets/Images/forceRain.png')} style={styles.weatherStatIcon} />
                      <Text style={[styles.weatherStatText, { color: Colors.textColor, fontFamily : global.fontStyles.SemiBold }]}>
                        {selectedWeather?.data[0]?.speed ? `${selectedWeather?.data[0]?.speed}/h` : '--'}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.weatherStatItem}>
                      <Image source={require('../../assets/Images/dropIcon.png')} style={styles.weatherStatIcon} />
                      <Text style={[styles.weatherStatText, { color: Colors.textColor, fontFamily : global.fontStyles.SemiBold }]}>
                        {selectedWeather?.data[0]?.humidity ? `${selectedWeather?.data[0]?.humidity}%` : '--'}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.weatherStatItem}>
                      <Image source={require('../../assets/Images/cloud.png')} style={styles.weatherStatIcon} />
                      <Text style={[styles.weatherStatText, { color: Colors.textColor,fontFamily : global.fontStyles.SemiBold}]}>
                        {selectedWeather?.data[0]?.rain !== undefined ? `${selectedWeather?.data[0]?.rain}%` : '--'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '100%', height: 1, borderBottomWidth: 0.5, borderColor: Colors.lightgrey, marginTop: 10 }} />
                  <FlatList
                    data={item?.data}
                    nestedScrollEnabled={true}
                    renderItem={({ item: subItem }) => {
                      return <View style={[styles.forecastItem, { justifyContent: 'center', alignItems: 'center' }]}>
                        <View style={
                          {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }
                        } >
                          <Text style={[styles.forecastTemp, { color: Colors.textColor, width: 25,fontFamily : global.fontStyles.SemiBold }]}>
                            {Math.round(subItem?.max_temp) || '--'}
                          </Text>
                          <Text style={[styles.degreeText, { color: Colors.textColor, marginTop: -3 ,fontFamily : global.fontStyles.SemiBold }]}>{"°c"}</Text>
                        </View>
                        {subItem?.image &&
                          <Image source={{ uri: subItem?.image }} style={styles.forecastIcon} />
                        }

                        <Text style={[styles.forecastTemp, { color: Colors.textColor,fontFamily: global.fontStyles.Regular }]}>
                          {subItem.time}
                        </Text>
                      </View>
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContainer}

                  />
                </View> :
                  <TouchableOpacity
                    disabled={selectedFilter === translate("Days_Forecast_15")}
                    activeOpacity={0.5}
                    onPress={() => {
                      // Alert.alert(item)
                      if (selectedWeather) {
                        setSelectedWeather('')
                        setSelectedWeather(item)
                      } else {
                        setSelectedWeather(item)
                      }
                    }}
                    style={styles.container}>
                    <View style={styles.tempContainer}>
                      {(
                        <View style={styles.tempWrapper}>
                          <Text style={[styles.tempText, { color: Colors.textColor,fontFamily:global.fontStyles.Regular }]}>
                            {selectedFilter === translate("Days_Forecast_15") ? item?.displayDay : item?.data[0]?.displayDay || '--'}
                          </Text>
                        </View>
                      )}

                      <View style={styles.rangeContainer}>
                        <Text style={[styles.rangeText,{fontFamily : global.fontStyles.Regular}]}>
                          {selectedFilter === translate("Days_Forecast_15") ? item?.date : moment(item?.data[0]?.dt_txt).format('DD-MMM-YYYY') || '--'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.iconContainer}>
                      <Image source={require("../../assets/Images/cloudeIconImg.png")} style={{
                        height: width * 0.1,
                        width: width * 0.1,
                        resizeMode: "contain"
                      }} />
                      <View style={styles.tempWrapper}>
                        <Text style={[styles.tempText, { color: Colors.textColor, fontSize: 27, marginTop: 10,fontFamily:global.fontStyles.Regular }]}>
                          {Math.round(selectedFilter !== translate("Days_Forecast_15") ? item?.data[0]?.max_temp : item?.max_temp) || '--'}
                        </Text>
                        <Text style={[styles.degreeText, { color: Colors.textColor, marginTop: 5,fontFamily:global.fontStyles.Regular }]}>{"°c"}</Text>
                      </View>
                    </View>
                    {selectedFilter !== translate("Days_Forecast_15") && <View style={[{ backgroundColor: Colors.app_theme_color, borderRadius: 5, padding: 5, alignItems: "center", justifyContent: "center" }]}>
                      <Image style={[{ height: 10, width: 10, tintColor: Colors.secondaryColor }]} resizeMode='contain' source={selectedWeather === item ? require('../../assets/Images/up_arrow.png') : require('../../assets/Images/up_arrow.png')}></Image>

                    </View>}
                  </TouchableOpacity>
              )
            }}
          />
        }
        <Modal visible={isCalendarVisible} transparent animationType="slide">
          <TouchableWithoutFeedback>

            <View style={styles.modalMainContainer}>
              <View style={styles.modalSubContainer}>
                <TouchableOpacity onPress={closeDate} style={{
                  position: "absolute", right: 5, top: 5,
                  borderRadius: 40, height: 25, width: 25, alignItems: "center", justifyContent: "center",
                  backgroundColor: Colors.textColor
                }}>
                  <Image source={require("../../assets/Images/crossIcon.png")} style={{ height: 10, width: 10, resizeMode: "contain", tintColor: Colors.white_color }} />
                </TouchableOpacity>
                <Calendar
                theme={{
                  textDayFontFamily: fonts.Regular, 
                  textMonthFontFamily: fonts.Bold,
                  textDayHeaderFontFamily: fonts.Regular,
                }}
                  onDayPress={(day) => {
                    setSelectedDatePest(moment(day.dateString, "YYYY-MM-DD HH:mm:ss.S").format("DD-MMM-YYYY"));
                    setRawDate(day.dateString)
                    getDiseasesFromMap(day.dateString)
                    setCalendarVisible(false);
                    

                  }}
                  markedDates={
                    selectedDate ? { [selectedDate]: { selected: true, marked: true, selectedColor: Colors.app_theme_color } } : {}
                  }
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          supportedOrientations={['portrait', 'landscape']}
          visible={showDropDowns}
          // onRequestClose={onBackdropPress}
          animationType='slide'
          transparent={true}
        // style={style}
        >
          <View style={styles.modalMainContainer1}>
            <View style={styles.modalSubParentContainer}>
              <View style={styles.closeBtnContainer}>
                <TouchableOpacity onPress={() => setShowDropDowns(false)}>
                  <Image source={require('../../assets/Images/crossIcon.png')} style={styles.closeIcon} />
                </TouchableOpacity>
              </View>
              {cropList?.length > 0 ? (
                <FlatList
                  data={cropList}
                  style={styles.flatListStyle}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => onPressDropdownItem(item)}>
                      <View style={styles.flatListRenderStyles}>
                        <Text style={{ color: Colors.textColor, fontSize: 14, lineHeight: 25,fontFamily : global.fontStyles.SemiBold }}>{item.name}</Text>
                      </View>
                      {cropList.length - 1 !== index &&
                        <View style={styles.lineDivider} />
                      }
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                />
              ) : (
                <View>
                  <Text style={styles.noDataAvailable}>{translate("No_data_available")}</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
        {loader && <CustomLoader visible={loader} />}
      </View>
  );
};

export default WeatherScreen;

