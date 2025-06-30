//import liraries
import React, { Component, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { changeLanguage, translate } from '../../Localization/Localisation';
import { useDispatch } from 'react-redux';
import { setCompanyDetails, setUserMenuControl, setUserProfile } from '../../redux/slices/userDataSlice';
import { initAppContext } from '../../Utility/AppInitializer';

// create a component
const HomeScreen = (route) => {
    const navigation = useNavigation()
    const dispactch = useDispatch();
    console.log("route", JSON.stringify(route))
    const finalJSON = route?.route?.params?.jsonParams

    useEffect(() => {
        const callInitValues = async () => {
            await initAppContext(finalJSON);

            changeLanguage(finalJSON?.languageCode)
            dispactch(setCompanyDetails(finalJSON?.companyDetails))
            dispactch(setUserMenuControl(finalJSON?.userMenuControl))
            dispactch(setUserProfile(finalJSON?.userProfile))

            navigation.navigate(finalJSON.classType)
        }
        callInitValues()
    }, [finalJSON])
    // var jsonParams = {
    //     "appVersionCode": "7",
    //     "appVersionName": "1.7",
    //     "applicationName": "subeej",
    //     "companyCode": "1100",
    //     "deviceId": "e34ab421bd29c503",
    //     "deviceToken": "",
    //     "deviceType": "android",
    //     "fcmToken": "f73URncaRSakzNfbZ_pY6c:APA91bHi7BI07d_ttbVZq9GaXeQtFTYgy_-e_6njwxbfdclQYRomYPGs0CgFrp6W3CFPNGEC3_1f0QiyQgUaYkRop4Wrt0a-5QWs0yR45pYDHIIiH3RtZ-4",
    //     "languageId": "1",
    //     "languageCode": "en",
    //     "mobileNumber": "7995436762",
    //     "referralCode": "613762SAI",
    //     "roleId": "2",
    //     "userId": "613",
    //     "userName": "Sai kiran Kathoju",
    //     companyDetails: {},
    //     userMenuControl: {},
    //     userProfile: {}
    // }


    // const callFromCropDiagnosis = async (navigationType) => {
    //     // await storeInAsyncStorage(APPLICATIONNAME, jsonParams?.applicationName)
    //     // await storeInAsyncStorage(VERSIONCODE, jsonParams?.appVersionCode)
    //     // await storeInAsyncStorage(VERSIONNAME, jsonParams?.appVersionName)
    //     // await storeInAsyncStorage(LANGUAGEID, jsonParams?.languageId)
    //     // await storeInAsyncStorage(MOBILENUMBER, jsonParams?.mobileNumber)
    //     // await storeInAsyncStorage(USER_ID, jsonParams?.userId)
    //     // await storeInAsyncStorage(FCMTOKEN, jsonParams?.fcmToken)
    //     // await storeInAsyncStorage(ROLEID, jsonParams?.roleId)
    //     // await storeInAsyncStorage(USERNAME, jsonParams?.userName)
    //     // await storeInAsyncStorage(REFERRALCODE, jsonParams?.referralCode)



    //     if (navigationType == 'CropDiagnosticsScreen') {
    //         navigation.navigate(finalJSON.classType)
    //     }
    //     else {
    //         navigation.navigate('WeatherScreen', {
    //             itemData: {
    //                 "coord": {
    //                     "lat": 17.4907,
    //                     "lon": 78.4146
    //                 }
    //             }
    //         })
    //     }
    // }

    // return (
    //     <View style={styles.container}>
    //         <TouchableOpacity onPress={() => navigation.navigate(finalJSON.classType)} style={{ borderWidth: 1, height: 50, width: 200, justifyContent: 'center' }}>
    //             <Text style={{ textAlign: 'center' }}>{translate('Crop_Diagnostic')}</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity onPress={() => callFromCropDiagnosis('WeatherScreen')} style={{ borderWidth: 1, height: 50, marginTop: 10, width: 200, justifyContent: 'center' }}>
    //             <Text style={{ textAlign: 'center' }}>{translate('weather')}</Text>
    //         </TouchableOpacity>
    //     </View>
    // );
};

//make this component available to the app
export default HomeScreen;
