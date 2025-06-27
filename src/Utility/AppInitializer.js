import AsyncStorage from '@react-native-async-storage/async-storage';
import { APPLICATIONNAME, FCMTOKEN, LANGUAGEID, MOBILENUMBER, REFERRALCODE, ROLEID, storeInAsyncStorage, USER_ID, USERNAME, VERSIONCODE, VERSIONNAME } from './Utils';

let appContext = {}; // shared memory

export const initAppContext = async (params = {}) => {
    const {
        applicationName,
        appVersionCode,
        appVersionName,
        languageId,
        mobileNumber,
        userId,
        fcmToken,
        roleId,
        userName,
        referralCode,
        languageCode,
        companyDetails,
        userMenuControl,
        userProfile,
    } = params;

    // Persist only what you need across sessions
    await AsyncStorage.multiSet([
        [APPLICATIONNAME, JSON.stringify(applicationName)],
        [VERSIONCODE, JSON.stringify(appVersionCode)],
        [VERSIONNAME, JSON.stringify(appVersionName)],
        [LANGUAGEID, JSON.stringify(languageId)],
        [MOBILENUMBER, JSON.stringify(mobileNumber)],
        [USER_ID, JSON.stringify(userId)],
        [FCMTOKEN, JSON.stringify(fcmToken)],
        [ROLEID, JSON.stringify(roleId)],
        [USERNAME, JSON.stringify(userName)],
        [REFERRALCODE, JSON.stringify(referralCode)],
    ]);
    // In-memory shared context
    appContext = {
        languageCode,
        companyDetails,
        userMenuControl,
        userProfile,
    };
};

export const getAppContext = () => appContext;
