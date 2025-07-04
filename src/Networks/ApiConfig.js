import { APPENVPROD, getFromAsyncStorage } from "../Utility/Utils";

export const FIREBASE_LOG = true;
export const APP_ENV_PROD = false;

// Informational responses (1xx)
export var STATUS_SUCCESS = "Success";
export var STATUS_CODE_SUCCESS_100 = 100;
export var STATUS_CODE_SUCCESS_200 = 200;
export var STATUS_CODE_SUCCESS_422 = 422;
export var STATUS_CODE_123 = 123;
export var STATUS_CODE_122 = 122;
export var STATUS_CODE_101 = 101;
export var STATUS_CODE_102 = 102;
export var STATUS_CODE_151 = 151;
export var STATUS_CODE_103 = 103;
export var STATUS_CODE_104 = 104;
export var STATUS_CODE_105 = 105;
export var STATUS_CODE_500 = 500;
export var STATUS_CODE_15 = 15;
export var STATUS_CODE_10 = 10;
export var STATUS_CODE_5 = 5;
export var STATUS_CODE_1 = 1;
export var STATUS_CODE_OK = "OK";
export var STATUS_CODE_601 = 601;


export const MAP_MY_INDIA_KEY = "5zf2txekry89tciw19sgmjpo7w133ioj";
export const MAP_MY_INDIA_URL = `https://apis.mapmyindia.com/advancedmaps/v1/${MAP_MY_INDIA_KEY}/rev_geocode`

const DEFAULT_PROD_URL = 'https://nvmretailpro.com:8443/rest/nsl/';
const DEFAULT_DEV_URL = 'http://3.110.159.82:8080/beejkisan/rest/nsl/';


let BASE_URL_NVM = DEFAULT_DEV_URL;
export const CONFIG_KEYS = {
    WEATHERDETAILS: {
        nslgetWeatherDetailsV1: "getWeatherDetails_v2",
        getPestForecastCrops: "getPestForecastCrops",
        getPestInformation: "getPestInformation",
        getRemedies: "processCropDiseaseRemedy",
    }
}

export const configs_nvm = {
    BASE_URL_NVM,
    ...CONFIG_KEYS,
}

export const loadApiConfig = async () => {
    try {
        const storedValue = await getFromAsyncStorage(APPENVPROD);
        const isProd = JSON.parse(storedValue);

        BASE_URL_NVM = isProd ? DEFAULT_PROD_URL : DEFAULT_DEV_URL;

        // ✅ Update the exported object (mutable reference)
        configs_nvm.BASE_URL_NVM = BASE_URL_NVM;
    } catch (e) {
        console.warn('loadApiConfig: Failed to read APPENVPROD, using DEV URL. Weather');
    }
};