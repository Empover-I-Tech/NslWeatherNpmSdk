import { Platform, Text, StatusBar, View, FlatList, Image, TouchableOpacity, Dimensions, Modal, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
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
import ApiConfig, { MAP_MY_INDIA_URL, STATUS_CODE_SUCCESS_200 } from '../../Networks/ApiConfig';
import ApiService from '../../Networks/ApiService';
import { getFromAsyncStorage, isNullOrEmptyNOTTrim, MOBILENUMBER, USER_ID } from '../../Utility/Utils';
import { useColors } from '../../colors/Colors';


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
      getWeatherData(route?.params?.itemData?.coord?.lat, route?.params?.itemData?.coord?.lon)
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
      getWeatherData(route?.params?.itemData?.coord?.lat, route?.params?.itemData?.coord?.lon)
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
    const url = ApiConfig.BASE_URL_NVM + ApiConfig.WEATHERDETAILS.nslgetWeatherDetailsV1
    if (isConnected) {
      setLoader(true)
      const body = {
        latitude: newLat,
        longitude: newLong,
        mobileNumber: await getFromAsyncStorage(MOBILENUMBER),
        userId: await getFromAsyncStorage(USER_ID),
      };
      const finalResponse = await ApiService.post(url, body, false)
      if (finalResponse.statusCode == "200" || finalResponse.statusCode == STATUS_CODE_SUCCESS_200) {
        setForecastData(finalResponse.response.dailyBaseWeatherInfo)
        setHourlyData(finalResponse.response.hourlyBaseWeatherInfo)
        let res = await getDetailsFromLatlong(newLat, newLong)
        setCityDet(res)
        setLoader(false)
      } else {
        setLoader(false)
        SimpleToast.show(!isNullOrEmptyNOTTrim(finalResponse?.message) ? finalResponse?.message : translate('Something_went_wrong'));
      }
    } else {
      SimpleToast.show(translate("no_internet_connected"))
    }
  }


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
    const pestUrlInfo = ApiConfig.BASE_URL_NVM + ApiConfig.WEATHERDETAILS.getPestInformation
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
        if (finalResponse?.response?.pestForecast.length > 0) {
          let pestForecastList = finalResponse.response.pestForecast
          setPestForecastData(pestForecastList)
          setLoader(false)
        } else {
          setFallBackTest(finalResponse?.message || translate("No_pests_detected_moment_later"))
          setLoader(false)
          SimpleToast.show(!isNullOrEmptyNOTTrim(finalResponse?.message) ? finalResponse?.message : translate('Something_went_wrong'));
        }
      } catch (erro) {
        setLoading(false)
      }
    } else {
      setLoading(false)
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
        var url = ApiConfig.BASE_URL_NVM + ApiConfig.WEATHERDETAILS.getPestForecastCrops
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
        }, 1000);
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

  const callLocationNavigation = async () => {
    navigation.navigate('Location', { coordinates: { latitude: latitude, longitude: longitude, address: cityDet, screenName: "WeatherScreen", zoom: mapZoomingLevel } })
  }
  console.log("checkingZoomongLevel=-=->", mapZoomingLevel)

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
    <SafeAreaView style={[styles.weatherSafeAreaContainer, { backgroundColor: Colors.app_theme_color }]}>
      <View style={styles.mainContainer}>
        {Platform.OS === 'android' && <StatusBar backgroundColor={Colors.app_theme_color} barStyle={"light-content"} />}
        <View style={[styles.mainHeadersContainer, { backgroundColor: Colors.app_theme_color }]}>
          <View style={styles.mainSubHeadersContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackScreen}>
              <Image source={require("../../assets/Images/ScreenBackIcon.png")} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: Colors.secondaryColor }]}>
              {translate("weather")}
            </Text>
          </View>
        </View>

        {selectedFilter === translate("Days_Forecast_15") && forecastData &&
          <View style={[styles.weatherInfoCard]}>
            <View style={[styles.locationTimeContainer, { marginBottom: 0, }]}>

              <View style={[styles.locationContainer, { flexDirection: "column", alignItems: "center", }]}>
                <Text style={[styles.tempText, styles.tempText2]}>
                  {todayForecast[0]?.displayDay || '--'}
                </Text>
                <Text style={styles.rangeText}>
                  {todayForecast[0]?.date || '--'}
                </Text>
              </View>

              <TouchableOpacity onPress={() => { callLocationNavigation() }}
                style={[styles.locationContainer, { marginTop: -responsiveHeight(4) }]}>
                <Image source={require("../../assets/Images/locationImgIcon.png")} style={styles.locationIcon} />
                <Text style={[styles.locationText, { color: Colors.textColor }]}>
                  {(todayForecast[0]?.city) || '--'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weatherDetails}>
              <View style={styles.weatherDescriptionContainer}>
                <Image source={{ uri: todayForecast[0]?.image }} style={styles.weatherTodayForecastImg} />

                <View style={styles.weatherDescription}>

                  <Text style={[styles.weatherDescText, { color: Colors.yellow_rgba, fontWeight: "400", minWidth: "80%", fontSize: 15 }]}>
                    {todayForecast[0]?.weather_description || "--"}
                  </Text>

                  {todayForecast[0]?.max_temp ?
                    <View style={styles.todayForecastMaxTempContainer}>
                      <Text style={[styles.tempText, { color: Colors.textColor, fontSize: 34 }]}>
                        {Math.round(todayForecast[0]?.max_temp)}
                      </Text>
                      <Text style={[styles.degreeText, { color: Colors.textColor, marginTop: -3 }]}>{"°c"}</Text>
                    </View> : <Text style={[styles.tempText, { color: Colors.textColor }]}>
                      {'--'}
                    </Text>
                  }

                  <View style={styles.tempRange}>
                    {todayForecast[0]?.max_temp ?
                      <View style={styles.todaysWeatherContainer}>
                        <Text style={[styles.rangeText, { color: Colors.lightish_grey }]}>
                          {`${translate('high')} ${Math.round(todayForecast[0]?.max_temp)}`}
                        </Text>
                        <Text style={[styles.degree2Text, { color: Colors.lightish_grey }]}>{"°"}</Text>
                      </View> :

                      <Text style={[styles.tempText, { color: Colors.lightish_grey }]}>
                        {'--'}
                      </Text>}
                    <View style={styles.divider} />
                    {todayForecast[0]?.min_temp ?
                      <View style={styles.todaysWeatherContainer2}>
                        <Text style={[styles.rangeText, { color: Colors.lightish_grey }]}>
                          {`${translate('Low')} ${Math.round(todayForecast[0]?.min_temp)}`}
                        </Text>
                        <Text style={[styles.degree2Text, { color: Colors.lightish_grey }]}>{"°"}</Text>
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
                <Text style={[styles.weatherStatText, { color: Colors.textColor }]}>
                  {todayForecast[0]?.speed ? `${todayForecast[0]?.speed}/h` : '--'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.weatherStatItem}>
                <Image source={require('../../assets/Images/dropIcon.png')} style={styles.weatherStatIcon} />
                <Text style={[styles.weatherStatText, { color: Colors.textColor }]}>
                  {todayForecast[0]?.humidity ? `${todayForecast[0]?.humidity}%` : '--'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.weatherStatItem}>
                <Image source={require('../../assets/Images/cloud.png')} style={styles.weatherStatIcon} />
                <Text style={[styles.weatherStatText, { color: Colors.textColor }]}>
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
            <Text style={[styles.tabText, { color: selectedFilter === translate("Days_Forecast_15") ? Colors.secondaryColor : Colors.app_theme_color, }]}>{translate("Days_Forecast_15")}</Text>
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
            <Text style={[styles.tabText, { color: selectedFilter === translate("Hourly") ? Colors.secondaryColor : Colors.app_theme_color }]}>3 {translate("Hourly")}</Text>
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
            <Text style={[styles.tabText, { color: selectedFilter === translate('PestForecast') ? Colors.secondaryColor : Colors.app_theme_color }]}>{translate('PestForecast')}</Text>
          </TouchableOpacity>
        </View>

        {selectedFilter === translate('PestForecast') ?
          <View style={[styles.weatherInfoCard, styles.weatherInfOCard1]}>

            <View style={[styles.locationTimeContainer, { marginBottom: 0, }]}>
              <View style={[styles.locationContainer, { flexDirection: "column", alignItems: "center", }]}>
                <Text style={[styles.tempText, styles.locationDetailsText]}>
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
            <Text style={[styles.forecastTemp, { color: Colors.textColor, fontWeight: "400", fontSize: 12 }]}>
              {translate("Showing_infestation_Forecast")}
            </Text>
            <View style={styles.locationDetailsMainContainer}>
              <View>
                <Text style={[styles.forecastTemp, styles.locationStateText]}>{translate("State")}</Text>
                <Text style={[styles.forecastTemp, styles.locationStateValueText]}>{cityDet?.state || '--'}</Text>
              </View>
              <View>
                <Text style={[styles.forecastTemp, styles.locationStateText]}>{translate("District")}</Text>
                <Text style={[styles.forecastTemp, styles.locationStateValueText]}>{cityDet?.district || '--'}</Text>
              </View>
              <View>
                <Text style={[styles.forecastTemp, styles.locationStateText]}>{translate("new_village")}</Text>
                <Text style={[styles.forecastTemp, styles.locationStateValueText]}>{cityDet?.village || cityDet?.locality || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.cropsLineDivider} />

            {cropList && cropList.length > 0 &&
              <View style={styles.cropsListMaincontainer}>
                <View style={styles.calendarDropDownMainContainer}>
                  <Text style={styles.sowingdateText}>{translate("Crop")}</Text>
                  <TouchableOpacity onPress={() => setShowDropDowns(true)} style={[styles.textInputContainer, { borderColor: Colors.lightish_grey }]}>
                    <Text style={styles.selectCropTextInput}>{selectedCrop != undefined && selectedCrop != translate('select') ? selectedCrop : translate('select')}</Text>
                    <Image source={require('../../assets/Images/down_arow.png')} style={[styles.dropDownIcon, { tintColor: Colors.black_color }]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.calendarDropDownMainContainer}>
                  <Text style={styles.sowingdateText}>{translate("sowing_date")}</Text>
                  <TouchableOpacity onPress={handleDateModal} style={[styles.textInputContainer, { borderColor: Colors.lightish_grey }]}>
                    <Text style={styles.selectCropTextInput}>{selectedDatePest}</Text>
                    <Image source={require('../../assets/Images/calendarIcon.png')} style={[styles.dropDownIcon, { tintColor: Colors.textColor }]} />
                  </TouchableOpacity>
                </View>
              </View>
            }
            {(pestForecastData != null && pestForecastData.length) &&
              <View style={styles.pestDiseasesContainer}>
                <Text style={styles.pestDiseasesText}>{translate('PestDiseases')}</Text>
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
                          <Text style={styles.pestText}>{item?.pests}</Text>
                          {item?.description && <Text style={styles.pestDescription}>{item?.description}</Text>}
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
            renderItem={({ item }) => {
              return (
                JSON.stringify(selectedWeather) === JSON.stringify(item) ? <View
                  style={[styles.weatherInfoCard, { marginBottom: 5, marginTop: 5, padding: 10 }]}>
                  <View style={[styles.locationTimeContainer, { marginBottom: 0, }]}>

                    <View style={[styles.locationContainer, { flexDirection: "column", alignItems: "center", }]}>
                      <Text style={[styles.tempText, { color: Colors.textColor, marginHorizontal: 0, textAlign: "left", alignSelf: "flex-start" }]}>
                        {selectedWeather?.data[0]?.displayDay}
                      </Text>
                      <Text style={styles.rangeText}>
                        {moment(selectedWeather?.data[0]?.dt_txt).format('DD-MMM-YYYY')}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                      <TouchableOpacity
                        onPress={() => {
                          callLocationNavigation()
                        }} style={styles.locationContainer}>
                        <Image source={require("../../assets/Images/locationImgIcon.png")} style={styles.locationIcon} />
                        <Text style={[styles.locationText, { color: Colors.textColor }]}>
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
                        <Text style={[styles.weatherDescText, { color: Colors.yellow_rgba, fontFamily: "Poppins-SemiBold", fontWeight: "400", minWidth: "80%", fontSize: 15 }]}>
                          {selectedWeather?.data[0]?.weather_description || "--"}
                        </Text>


                        {selectedWeather?.data[0]?.max_temp ?
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={[styles.tempText, { color: Colors.textColor, fontSize: 34 }]}>
                              {Math.round(selectedWeather?.data[0]?.max_temp)}
                            </Text>
                            <Text style={[styles.degreeText, { color: Colors.textColor, marginTop: -3 }]}>{"°c"}</Text>
                          </View> : <Text style={[styles.tempText, { color: Colors.textColor }]}>
                            {'--'}
                          </Text>}

                        <View style={styles.tempRange}>
                          {selectedWeather?.data[0]?.max_temp ?
                            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 5 }}>
                              <Text style={[styles.rangeText, { color: Colors.lightish_grey }]}>
                                {`${translate('high')} ${Math.round(selectedWeather?.data[0]?.max_temp)}`}
                              </Text>
                              <Text style={[styles.degree2Text, { color: Colors.lightish_grey }]}>{"°"}</Text>
                            </View> :

                            <Text style={[styles.tempText, { color: Colors.lightish_grey }]}>
                              {'--'}
                            </Text>}
                          <View style={styles.divider} />
                          {selectedWeather?.data[0]?.min_temp ?
                            <View style={{ flexDirection: "row", alignItems: 'center', marginLeft: 5 }}>
                              <Text style={[styles.rangeText, { color: Colors.lightish_grey }]}>
                                {`${translate('Low')} ${Math.round(selectedWeather?.data[0]?.min_temp)}`}
                              </Text>
                              <Text style={[styles.degree2Text, { color: Colors.lightish_grey }]}>{"°"}</Text>
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
                      <Text style={[styles.weatherStatText, { color: Colors.textColor }]}>
                        {selectedWeather?.data[0]?.speed ? `${selectedWeather?.data[0]?.speed}/h` : '--'}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.weatherStatItem}>
                      <Image source={require('../../assets/Images/dropIcon.png')} style={styles.weatherStatIcon} />
                      <Text style={[styles.weatherStatText, { color: Colors.textColor }]}>
                        {selectedWeather?.data[0]?.humidity ? `${selectedWeather?.data[0]?.humidity}%` : '--'}
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.weatherStatItem}>
                      <Image source={require('../../assets/Images/cloud.png')} style={styles.weatherStatIcon} />
                      <Text style={[styles.weatherStatText, { color: Colors.textColor }]}>
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
                          <Text style={[styles.forecastTemp, { color: Colors.textColor, width: 25, }]}>
                            {Math.round(subItem?.max_temp) || '--'}
                          </Text>
                          <Text style={[styles.degreeText, { color: Colors.textColor, marginTop: -3 }]}>{"°c"}</Text>
                        </View>
                        {subItem?.image &&
                          <Image source={{ uri: subItem?.image }} style={styles.forecastIcon} />
                        }

                        <Text style={[styles.forecastTemp, { color: Colors.textColor, fontFamily: "Poppins-Regular", fontWeight: "400" }]}>
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
                          <Text style={[styles.tempText, { color: Colors.textColor }]}>
                            {selectedFilter === translate("Days_Forecast_15") ? item?.displayDay : item?.data[0]?.displayDay || '--'}
                          </Text>
                        </View>
                      )}

                      <View style={styles.rangeContainer}>
                        <Text style={styles.rangeText}>
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
                        <Text style={[styles.tempText, { color: Colors.textColor, fontSize: 27, marginTop: 10 }]}>
                          {Math.round(selectedFilter !== translate("Days_Forecast_15") ? item?.data[0]?.max_temp : item?.max_temp) || '--'}
                        </Text>
                        <Text style={[styles.degreeText, { color: Colors.textColor, marginTop: 5 }]}>{"°c"}</Text>
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
                        <Text style={{ color: Colors.textColor, fontSize: 14, lineHeight: 25 }}>{item.name}</Text>
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
    </SafeAreaView>
  );
};

export default WeatherScreen;

