import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { STATUS_CODE_103, STATUS_CODE_601, STATUS_CODE_SUCCESS_200 } from './ApiConfig';
import { APPLICATIONNAME, COMPANYCODE, FCMTOKEN, getFromAsyncStorage, isNullOrEmptyNOTTrim, LANGUAGEID, MOBILENUMBER, REFERRALCODE, ROLEID, USER_ID, USERNAME, VERSIONCODE, VERSIONNAME } from '../Utility/Utils';

// Replace these with actual utility functions or constants
async function getDeviceId() {
  return DeviceInfo.getUniqueId();
}
async function getAppVersionCode() {
  return DeviceInfo.getBuildNumber();
}
async function getAppVersionName() {
  return DeviceInfo.getVersion();
}

async function getApplicationName() {
  return DeviceInfo.getApplicationName();
}

function constructFailureObject(message) {
  return {
    statusCode: 0,
    message: message ?? translate('something_went_wrong'),
    response: null, // better to use null instead of an empty string if no data
  };
}

async function forceLogoutUser() {

}


class ApiService {
  static async getCommonHeaders(extraHeaders = {}, formData = false) {
    const deviceId = await getDeviceId();
    const versionCode = await getFromAsyncStorage(VERSIONCODE);
    const versionName = await getFromAsyncStorage(VERSIONNAME);
    const applicationName = await getFromAsyncStorage(APPLICATIONNAME);
    const selectedLanguageId = await getFromAsyncStorage(LANGUAGEID);
    const loggedInMobileNumber = await getFromAsyncStorage(MOBILENUMBER)
    const loggedInUserId = await getFromAsyncStorage(USER_ID)
    const companyCode = await getFromAsyncStorage(COMPANYCODE)
    const fcmTokenApp = await getFromAsyncStorage(FCMTOKEN)
    const roleId = await getFromAsyncStorage(ROLEID)
    const username = await getFromAsyncStorage(USERNAME)
    const referralCode = await getFromAsyncStorage(REFERRALCODE)
    console.log("selectedLanguageId", selectedLanguageId)
     console.log("formData", formData)
    return {
      "Accept": "application/json",
      "Content-Type": formData ? "multipart/form-data" : 'application/json',
      deviceId: deviceId,
      deviceToken: '',
      appVersionCode: versionCode,
      appVersionName: versionName,
      applicationName: applicationName,
      companyCode: companyCode,
      fcmToken: fcmTokenApp,
      deviceType: Platform.OS,
      languageId: Number(selectedLanguageId) || 1,
      mobileNumber: loggedInMobileNumber,
      userId: loggedInUserId,
      referralCode: referralCode,
      roleId: roleId,
      userName: username,
      authType: "JSONREQUEST",
      ...extraHeaders,
    };
  }

  static async post(url, body = {}, extraHeaders = {}, formData) {
    const headers = await this.getCommonHeaders(extraHeaders, formData);
    console.log("URL===>", url)
    console.log("headers", headers)
    console.log("body", body)
    console.log("extraHeaders", extraHeaders)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData ? body : JSON.stringify(body),
      });

      const responseJson = await response.json();
      console.log("responseJson", JSON.stringify(responseJson))
      if (responseJson.statusCode == 200 || responseJson.statusCode == STATUS_CODE_SUCCESS_200) {
        return responseJson;
      }
      else if ((responseJson.statusCode == 103) || (responseJson.statusCode == STATUS_CODE_103)) {
        return responseJson;
      }
      else if (responseJson.statusCode == 404) {
        return constructFailureObject('No Http resource found');
      } else if (responseJson.status == 401 || responseJson.statusCode == 401) {
        return constructFailureObject('Unauthorised Request');
      } else if (responseJson.status == 500 || responseJson.statusCode == 500) {
        return constructFailureObject('Internal Server Error');
      } else if (responseJson.status == 503 || responseJson.statusCode == 503) {
        return constructFailureObject('Server down');
      } else if (responseJson.status == 504 || responseJson.statusCode == 504) {
        return constructFailureObject('Request Timed out');
      } else if ((responseJson.statusCode == 601) || (response.statusCode == STATUS_CODE_601)) {
        forceLogoutUser();
        return;
      } else {
        return constructFailureObject(!isNullOrEmptyNOTTrim(responseJson.message) ? responseJson.message : 'Something went wrong');
      }

    } catch (error) {
      return constructFailureObject(error.message);
      // return { success: false, error: error.message };
    }
  }

  static async get(url, extraHeaders = {}) {
    const headers = await this.getCommonHeaders(extraHeaders, false);
    console.log("URL===>", url)
    console.log("headers", headers)
    console.log("extraHeaders", extraHeaders)
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      const responseJson = await response.json();
      console.log("responseJson", JSON.stringify(responseJson))
      if (responseJson.responseCode == 200) {
        console.log("responseJson.responseCode", JSON.stringify(responseJson))
        return responseJson;
      }
      else if ((responseJson.statusCode == 200) || (responseJson.statusCode == STATUS_CODE_SUCCESS_200)) {
        return responseJson;
      }
      else if (responseJson.statusCode == 404) {
        return constructFailureObject('No Http resource found');
      } else if (responseJson.statusCode == 401) {
        return constructFailureObject('Unauthorised Request');
      } else if (responseJson.statusCode == 500) {
        return constructFailureObject('Internal Server Error');
      } else if (responseJson.statusCode == 503) {
        return constructFailureObject('Server down');
      } else if (responseJson.statusCode == 504) {
        return constructFailureObject('Request Timed out');
      } else if ((responseJson.statusCode == 601) || (response.statusCode == STATUS_CODE_601)) {
        forceLogoutUser();
        return;
      } else {
        return constructFailureObject(!isNullOrEmptyNOTTrim(responseJson.message) ? responseJson.message : 'Something went wrong');
      }
    } catch (error) {
      return constructFailureObject(error.message);
    }
  }
}

export default ApiService;
