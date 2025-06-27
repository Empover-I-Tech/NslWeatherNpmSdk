import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { translate } from "../Localization/Localisation";


export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';
export const USER_ID = 'user_id';
export const TIMEOUT_DURATION = 5000;
export const SHOWONBOARDSCREENS = "show_onboard_screens";
export const JWTAUTHENTICATION = 'JWTAUTHENTICATION';
export const LANGUAGECODE = 'languageCode';
export const LANGUAGENAME = 'languageName';
export const MOBILENUMBER = 'mobileNumber';
export const USERNAME = 'userName';
export const LANGUAGEID = 'languageId';
export const ROLDID = 'roleId';
export const REFERRALCODE = 'referralCode';
export const USER_IMG = "userImg"
export const STATE_ID = "STATEID"
export const DISTRICT_ID = "DISTRICTID"
export const STATE_NAME = "STATE"
export const DISTRICT_NAME = "DISTRICT"
export const FIRSTNAME = 'FIRSTNAME';
export const LASTNAME = 'LASTNAME';
export const OFFLINETOTALCOUNT = "OFFLINETOTALCOUNT";
export const COMPANYCODE = "COMPANYCODE"
export const VERSIONCODE = "VERSIONCODE"
export const VERSIONNAME = "VERSIONNAME"
export const APPLICATIONNAME = "APPLICATIONNAME"
export const FCMTOKEN = "FCMTOKEN"
export const ROLEID = "ROLEID"
export const REFFERALCODE = "REFFERALCODE"


export async function getSystemVersion() {
    let deviceId = DeviceInfo.getSystemVersion()
    return deviceId;
}

export async function getAppVersion() {
    let version = DeviceInfo.getVersion();
    console.log("APPVERSION", version);
    return version;
}
export async function getBuildNumber() {
    let number = DeviceInfo.getBuildNumber();
    return number;
}

export const getFormattedDateTime = async () => {
    const now = new Date();

    const pad = (n) => n.toString().padStart(2, '0');

    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1); // Months are zero-indexed
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${day}${month}${year}${hours}${minutes}${seconds}`;
};


export function forceLogoutUser() {

}


export function isNullOrEmpty(value) {
    if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
    ) {
        return true; // It IS null or empty
    }
    return false; // It has some value
}

export function isNullOrEmptyNOTTrim(value) {
    if (value === null || value === undefined || value === '') {
        return true; // It IS null or empty
    }
    return false; // It has some value
}


export const isEmptyValueObject = (value) => {
    return (
        value === null ||
        value === undefined ||
        (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
    );
};



export const storeInAsyncStorage = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        console.log(`Stored ${key} => ${jsonValue} successfully in AsyncStorage.`);
    } catch (error) {
        console.error(`Failed to store ${key} in AsyncStorage:`, error);
    }
};

export const getFromAsyncStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            const parsed = JSON.parse(value);
            console.log(`Retrieved ${key} successfully from AsyncStorage.`);
            return parsed;
        } else {
            console.log(`${key} not found in AsyncStorage.`);
            return null;
        }
    } catch (error) {
        console.error(`Failed to retrieve ${key} from AsyncStorage:`, error);
        return null;
    }
};


export const deleteFromAsyncStorage = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log(`Deleted ${key} successfully from AsyncStorage.`);
    } catch (error) {
        console.error(`Failed to delete ${key} from AsyncStorage:`, error);
    }
};

export const getGreetingMessage = () => {
    const hour = new Date().getHours();

    if (hour < 12) return translate("Good_morning");
    if (hour < 18) return translate("Good_afternoon");
    return translate("Good_evening");
};

export const normalizeText = (text) => {
    return text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
};