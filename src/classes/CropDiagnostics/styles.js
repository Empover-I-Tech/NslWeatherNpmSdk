import { StyleSheet,Dimensions } from "react-native";
const {height,width}=Dimensions.get("window")

const styles=StyleSheet.create({
    tabsContainer:{
        backgroundColor: "#ED32370F", 
        height: 45, 
        width:"90%", 
        alignSelf: "center", 
        marginTop:5, 
        borderRadius: 5, 
        marginBottom:2,
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between"
    },
    tabSubContainer:{
        width: "50%", 
        height: "100%", 
        borderRadius: 5, 
        alignItems: "center", 
        justifyContent: "center"
    },
    tabText:{
        fontSize: 14, 
        fontWeight: "500" 
    },
    cropDiagnosticsMainContainer:{
        marginVertical: 10, 
        height: '80%' 
    },
    eachCropDiagnosticsItemContainer:{
        width: "90%", 
        backgroundColor: "white", 
        marginVertical: 10, 
        alignSelf: "center", 
        elevation: 1, 
        borderRadius: 10, 
        padding: 10, 
        alignItems: "center", 
        justifyContent: "center", 
        paddingVertical: 15
    },
    eachCropDiagnosticsImage:{
        height: 60, 
        width: 60, 
        resizeMode: "contain", 
        alignSelf: "center" 
    },
    eachCropDiagnosticsText:{
        fontSize: 12, 
        alignSelf: "center", 
        marginTop: 5
    },
    noDataAvailableTextContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        height: 60
    },
    noDataText: {
        fontWeight: "500",
        fontSize: 16,
        color: "#ED3237"
    },
    listFooterContainer:{
        marginTop: 3,
        paddingHorizontal: 20
    },
    overallContainer: {
        flex: 1,
        backgroundColor: "rgba(52, 52, 52, 0.8)",
        alignItems: "center",
        justifyContent: "center"
    },
    subContainer: {
        height:"80%",
        width: "90%",
        alignSelf: "center",
        backgroundColor: "#fff",
        paddingBottom: 15,
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    imageData: {
        height: "85%",
        marginTop: 10,
        borderRadius: 10,
        width: "85%", 
        resizeMode: "cover", 
        alignSelf: "center",
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        alignSelf: 'center',
        marginTop: "auto"
    },
    button: {
        width: '45%',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        bottom: 10
    },
    clearButton: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '400',
    },
    dontShowAgainBtnContainer:{
        position: "absolute", 
        right: 15, 
        top: 20
    },
    dontShowAgainText:{
        color:"#ED3237", 
        fontSize: 12,
        fontWeight:"500"
    },
    cameraPopupIcon:{
         height: 250, 
         width: 250, 
         resizeMode: "contain", 
         alignSelf: "center", 
         marginTop:10 
    },
    carouselNameText:{
        color: "#ED3237", 
        fontSize: 13, 
        alignSelf: "center", 
        marginTop: 5,
        lineHeight:25
    },
    carouselDesText:{
       color: "#000", // dynamicstyle
       fontSize: 11, 
       alignSelf: "center", 
       textAlign: "center", 
       width: "92%", 
       marginTop: 5,
       lineHeight:20
    },
    lineDividerContainer:{
        alignSelf: "center", 
        flexDirection: "row", 
        alignItems: "center",
        marginVertical:20
    },
    lineDividerOne:{
        height: 10, 
        width: 10, 
        backgroundColor: "#ED3237", 
        borderRadius: 60, 
        marginRight: 2.5
    },
    lineDividerOneCopy: {
        height: 10, 
        width: 10, 
        borderColor: "#ED3237", 
        borderRadius: 60, 
        borderWidth: 1, 
        marginRight: 2.5
    },
    lineDividerTwo:{
        height: 10, 
        width: 10, 
        backgroundColor: "#ED3237", 
        borderRadius: 60 
    },
    lineDividerTwoCopy: {
         height: 10, 
         width: 10, 
         borderColor: "#ED3237", 
         borderRadius: 60, 
         borderWidth: 1 
    },
    noDataAvaiableHistoryContainer:{
        alignSelf: 'center', 
        justifyContent: 'center', 
        flex: 1
    },
    noDataAvailableHistoryText:{
        color: 'red', 
        marginLeft: 10, 
        fontFamily: "Poppins-SemiBold", 
        fontWeight: '500', 
        fontSize: 14 
    },
    cropDiagnosticsHistoryListContainer: {
        width: "90%",
        backgroundColor: "white",
        marginVertical: 10,
        alignSelf: "center",
        elevation: 1,
        borderRadius: 10,
        padding: 10
    },
    cropDiagnosticsHistoryListSubContainer: {
         flex: 1, 
         borderWidth: 2, 
         borderColor: "rgba(0, 0, 0, 0.05)", 
         borderRadius: 10 
    },
    diseasesDetectedContainer:{
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#FFF1F1", 
        height: 35, 
        paddingHorizontal: 10
    },
    diseaseDetectedIcon:{
        height: 20, 
        width: 20, 
        resizeMode: "contain"
    },
    diseasesDetectedTitle:{
        color:"#ED3237", 
        marginLeft: 10, 
    },
    diseasesDetectedDetailsContainer:{
        padding: 10, 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between" 
    },
    diseasesDetectedDetailsSubContainer:{
        flexDirection: "row", 
        alignItems: "center",
    },
    diseasesDetectedImg:{
        height: 65, 
        width: 65, 
        resizeMode: "contain", 
    },
    diseasesDetectedDiseasesName: {
        color:"#000",
        marginLeft: 10,
        fontSize: 12
    },
    diseasesCropName: {
        color: "#000",
        marginLeft: 10,
        fontSize: 10
    },
    diseasesDetectedCreatedOnText: {
        color: 'rgba(85, 85, 85, 1)',
        marginLeft: 10,
        fontSize: 10
    },
    diseasesDetectedViewBtnContainer:{
         maxWidth: "40%", 
         alignItems: "center", 
         justifyContent: "center", 
         padding: 8, 
         margin: 8, 
         borderWidth: 1, 
         borderColor:"#ED3237", 
         borderRadius: 5 
    },
    viewDetailsText:{
        color:"#ED3237"
    },
    cropDiseasesDetection:{
        backgroundColor: "rgba(242, 246, 249, 1)", 
        flex: 1 
    },
    detectImage:{
        width: "100%", 
        height: 200, 
        borderBottomLeftRadius:20, 
        borderBottomRightRadius:20, 
        resizeMode: 'cover' 
    },
    detectSubCard:{
        backgroundColor: "#fff", 
        width: "90%", 
        alignSelf: "center", 
        marginTop: 20, 
        borderRadius: 10,
    },
    diseaseDetailsNameContainer:{
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        margin: 10 
    },
    diseaseNameText:{
        fontSize: 14,  
        fontWeight: "bold",
        color: "grey",
    },
    diseaseName:{
         color:"#000", 
         fontFamily: "Inter-Bold", 
         fontWeight: '900', 
         fontSize: 14 
    },
    whatsappIconContainer: {
        borderColor: '#0CB500',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0CB500',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    whatsAppIcon:{
        width: 25, 
        height: 25, 
        resizeMode: "contain"
    },
    dividerLine:{
        height: 2, 
        backgroundColor: 'rgba(242, 246, 249, 1)', 
        marginVertical: 7,
        margin: 10 
    },
    mostPossibleDiagnosisText: {
        color:"#000",
        marginLeft: 10,
        fontWeight: '500',
        fontSize:14,
        lineHeight: 25
    },
    diagnosisTextContainer:{
        margin: 0, 
        width: '90%'
    },
    diagnosisText:{
        color:"#000", 
        marginLeft: 10, 
        margin: 2, 
        fontWeight: '400', 
        fontSize: 14, 
        lineHeight: 25 
    },
    advisoryContainer:{
        marginBottom: 10, 
        maxHeight: height * 0.35
    },
    diagnosisPointsContainer:{
        marginHorizontal: 10, 
        flexDirection: 'row' 
    },
    diagnosisPointText:{
        color:"#000", 
        fontSize:14, 
        lineHeight: 25
    },
    noDataAvailableToolsText:{
        color:"#000", 
        marginLeft: 10, 
        margin: 2, 
        fontWeight: '400', 
        fontSize: 13
    },
    viewShotContainer: {
        width: '100%',
        height: '100%',
    },
    viewShotSubContainer: {
        width: "100%",
        borderRadius: 5,
        marginBottom: 5,
        paddingBottom: 5,
    }

})

export default styles