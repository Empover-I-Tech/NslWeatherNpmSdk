import { StyleSheet, Dimensions, StatusBar, Platform } from "react-native";
import { responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";
import { Colors } from "../../colors/Colors";
const { height, width } = Dimensions.get("window")

const styles = StyleSheet.create({
    weatherSafeAreaContainer: {
        // paddingTop:Platform.OS==="android"?StatusBar.currentHeight+30:0
    },
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.lightgrey
    },
    mainHeadersContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        width: "100%",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        // height: 60,
    },
    mainSubHeadersContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "60%",
        justifyContent: "space-between",
        paddingLeft: 20,
        alignItems: "center",
    },
    backButton: {
        height: 50,
        width: 50,
        resizeMode: "contain",
    },
    backIcon: {
        height: 40,
        width: 40,
        resizeMode: "contain",
    },
    headerText: {
        // fontWeight: "bold",
        fontSize: 18,
    },
    weatherInfoCard: {
        width: "90%",
        alignSelf: "center",
        marginTop: 30,
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: Colors.black_color,
        backgroundColor: Colors.white_color,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2
    },
    locationTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    tempText: {
        fontSize: 15,
        // fontWeight: '400',
        marginHorizontal: 5
    },
    tempText2: {
        color: Colors.black_color,
        marginHorizontal: 0,
        textAlign: "left",
        alignSelf: "flex-start"
    },
    locationText: {
        marginLeft: 5,
        fontSize: 12,
        // fontWeight: "600"
    },
    locationIcon: {
        height: width * 0.05,
        width: width * 0.05,
        resizeMode: "contain",
        marginRight: 6
    },
    weatherDetails: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 10
    },
    weatherDescriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    weatherTodayForecastImg: {
        height: width * 0.3,
        width: width * 0.3,
        resizeMode: "contain"
    },
    weatherDescription: {
        marginLeft: 35
    },
    weatherDescText: {
        fontSize: 25,
        // fontWeight: '500',
        textTransform: 'capitalize',
        width: "65%"
    },
    todayForecastMaxTempContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    degreeText: {
        fontSize: 14,
        // fontWeight: '400',
        marginTop: 35,
        marginLeft: 2
    },
    tempRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%'
    },
    todaysWeatherContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 5
    },
    todaysWeatherContainer2: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 5
    },
    rangeText: {
        fontSize: responsiveFontSize(1.8),
        // fontWeight: '400',
        color: Colors.lighy_black,
    },
    degree2Text: {
        fontSize: 14,
        // fontWeight: '400',
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: Colors.lightish_grey
    },
    weatherStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 6
    },
    weatherStatItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    weatherStatIcon: {
        width: 20,
        height: 20,
        resizeMode: "contain"
    },
    weatherStatText: {
        marginLeft: 5,
        fontSize: 14,
        // fontWeight: "600"
    },
    tabsMainContainer: {
        flexDirection: "row",
        alignSelf: "flex-end",
        marginRight: "5%",
        marginBottom: 15,
    },
    tabText: {
        // fontWeight: "300",
        fontSize: 10,
        marginTop: 1,
        textAlign: "center",
        lineHeight:20
    },
    weatherInfOCard1: {
        marginBottom: 5,
        marginTop: 5,
        padding: 10
    },
    locationDetailsText: {
        color: Colors.black_color,
        marginHorizontal: 0,
        textAlign: "left",
        alignSelf: "flex-start"
    },
    weatherLineDivider: {
        backgroundColor: Colors.lightgrey,
        height: 1,
        width: "100%",
        alignSelf: "center",
        marginVertical: 5
    },
    forecastTemp: { 
        marginTop: 5,
        fontSize: 14, 
        // fontWeight: '600' 
     },
    locationDetailsMainContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between"
    },
    locationStateText: {
        color: Colors.lighy_black,
        // fontWeight: "400",
        fontSize: 10
    },
    locationStateValueText: {
        color: Colors.black_color,
        // fontWeight: "700",
        fontSize: 11
    },
    cropsLineDivider: {
        backgroundColor: Colors.lightgrey,
        height: 1,
        width: "100%",
        alignSelf: "center",
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(0.5)
    },
    cropsListMaincontainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    calendarDropDownMainContainer: {
        width: "45%",
        height: 90
    },
    sowingdateText: {
        lineHeight: 30,
        color: Colors.black_color,
        marginBottom: 8,
        fontSize: 14,
        // borderWidth:1,
        height:35
    },
    textInputContainer: {
        backgroundColor: Colors.white_color,
        borderWidth: 1,
        height: 47,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 10,
        width: "100%",
    },
    selectCropTextInput: {
        fontSize: 14,
        // fontWeight: "400",
        lineHeight: 30,
        width: "90%",
        paddingLeft: 10,
        color: Colors.black_color
    },
    dropDownIcon: {
        height: 20,
        width: 20,
        tintColor: Colors.black_color,
        resizeMode: "contain"
    },
    pestDiseasesContainer: {
        borderWidth: 1,
        borderColor: Colors.lightgrey,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    pestDiseasesText: {
        color: Colors.black_color,
        // fontWeight: "600",
        fontSize: 12
    },
    pestForecastDiseasesListMainContainer: {
        maxHeight: height * 0.45
    },
    pestForecastDiseasesListSubContainer: {
        maxheight: 300, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingHorizontal: 10, paddingVertical: 10, borderColor: Colors.lightgrey, borderBottomRightRadius: 10, borderBottomLeftRadius: 10
    },
    peastEmptyText: {
        textAlign: "center",
        marginTop: 20, color: Colors.black_color,
        fontSize: 15
    },
    pestItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    pestImg: {
        height: 50,
        width: 50,
        resizeMode: "cover",
        borderRadius: 10
    },
    peastDetailsLine: {
        width: 1,
        height: "80%",
        backgroundColor: Colors.lightgrey
    },
    pestTextDetailsContainer: {
        width: '50%'
    },
    pestText: {
        color: Colors.black_color,
        // fontWeight: "600",
        fontSize: 14
    },
    pestDescription: {
        color: Colors.black_color,
        // fontWeight: "400",
        fontSize: 12
    },
    cloudIcon: {
        height: width * 0.3,
        width: width * 0.3,
        resizeMode: "contain"
    },
    forecastItem: { marginHorizontal: 5, paddingHorizontal: 3, marginTop: 5 },
    forecastIcon: {
        width: 40, height: 40, resizeMode: "contain", marginVertical: 3,
    },
    flatListContainer: { marginTop: 5 },
    container: {
        flexDirection: "row",
        alignItems: "center",
        height: responsiveHeight(10),
        width: "90%",
        backgroundColor: Colors.white_color,
        alignSelf: "center",
        borderRadius: 10,
        marginVertical: 5,
        paddingHorizontal: 10,
        elevation: 5
    },
    tempContainer: {
        width: "40%"
    },
    tempWrapper: {
        flexDirection: "row",
        alignItems: "center"
    },
    rangeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 5,
        marginTop: 0
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "45%",
        marginLeft: 'auto',
    },
    modalMainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.transparent
    },

    modalSubContainer: {
        width: 320,
        backgroundColor: Colors.white_color,
        borderRadius: 10,
        padding: 20,
        alignItems: "center"
    },
    modalMainContainer1: {
        width: "100%",
        height: "100%",
        backgroundColor: Colors.transparent,
        justifyContent: "center",
        alignItems: "center"
    },
    modalSubParentContainer: {
        width: "85%",
        borderRadius: 8,
        padding: 10,
        margin: 30,
        backgroundColor: Colors.white_color,
        paddingBottom: 15
    },
    closeBtnContainer: {
        alignSelf: "flex-end",
        top: 5
    },
    flatListStyle: {
        width: "100%",
        top: 10
    },
    lineDivider: {
        backgroundColor: Colors.lightgrey,
        height: 1,
        width: "100%",
        alignSelf: "center",
        marginVertical: 10
    },
    noDataAvailable: {
        color: Colors.black_color,
        alignSelf: "center",
        marginTop: 80,
        height: 40
    },
    closeIcon: {
        height: 15,
        width: 15,
        tintColor: Colors.black_color
    },
    remedyMainContainer: {
        flex: 1,
        backgroundColor: Colors.white_color,
        borderRadius: 10,
        margin: 10,
        width: "90%",
        alignSelf: "center",
        borderRadius: 10,
        shadowColor: Colors.black_color,
        backgroundColor: Colors.white_color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2
    },
    remedySubContainer: {
        margin: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    remedyNameText: {
        color: Colors.black_color,
        // fontWeight: '900',
        fontSize: 14,
        lineHeight: 30
    },
    remedyDescription: {
        color: Colors.black_color,
        fontSize: 14,
        lineHeight: 25
    },
    dignosisText: {
        color: Colors.black_color,
        fontSize: 14,
        marginBottom: 10
    },
    remedyPointsContainer: {
        flexDirection: 'row',
        width: "95%"
    },
    remedyPintsText: {
        color: Colors.black_color,
        fontSize: 14,
        lineHeight: 26
    },
    remedyNotAvailable: {
        color: Colors.black_color,
        marginLeft: 10,
        margin: 2,
        // fontWeight: '400',
        fontSize: 13
    },
    dividerTwo: {
        height: 2,
        backgroundColor: 'rgba(242, 246, 249, 1)',
        marginVertical: 7,
        margin: 10
    }



})

export default styles