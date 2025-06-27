import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

export const showPermissionAlert = (type, translate) => {
  const title = 'permission_required';
  const message = type === 'camera' ? 'cameraDesc' : 'galleryDesc';
  const cancelText = 'cancel';
  const settingsText = 'open_settings';

  Alert.alert(
    translate ? translate(title) : 'Permission Required',
    translate ? translate(message) : `We need ${type} permission to continue`,
    [
      { 
        text: translate ? translate(cancelText) : 'Cancel', 
        style: 'cancel' 
      },
      { 
        text: translate ? translate(settingsText) : 'Open Settings', 
        onPress: () => Linking.openSettings() 
      }
    ],
    { cancelable: true }
  );
};

export const requestCameraPermission = async (translate) => {
  if (Platform.OS == 'android') {
    const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
    const result = await PermissionsAndroid.request(permission);
    
    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return { granted: true };
    } else if (result === PermissionsAndroid.RESULTS.DENIED) {
      return { granted: false, blocked: false };
    } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      if (translate) showPermissionAlert('camera', translate);
      return { granted: false, blocked: true };
    }
  } else if (Platform.OS == 'ios') {
    const status = await request(PERMISSIONS.IOS.CAMERA);
    if (status === RESULTS.GRANTED) {
      return { granted: true };
    } else if (status === RESULTS.BLOCKED) {
      if (translate) showPermissionAlert('camera', translate);
      return { granted: false, blocked: true };
    } else {
      return { granted: false, blocked: false };
    }
  }
};

export const requestGalleryPermission = async (translate) => {
  if (Platform.OS === 'android') {
    const sdkVersion = Platform.Version;

    try {
      let granted = false;
      
      if (sdkVersion >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        granted = result === PermissionsAndroid.RESULTS.GRANTED;
      } else if (sdkVersion >= 29) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        granted = result === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);
        granted =
          result[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
          result[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;
      }

      if (!granted) {
        if (translate) showPermissionAlert('gallery', translate);
      }
      return { granted };
    } catch (error) {
      console.warn('Permission error:', error);
      return { granted: false, error };
    }
  } else if (Platform.OS === 'ios') {
    try {
      const status = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (status === RESULTS.GRANTED) {
        return { granted: true };
      } else if (status === RESULTS.BLOCKED) {
        if (translate) showPermissionAlert('gallery', translate);
        return { granted: false, blocked: true };
      } else {
        return { granted: false, blocked: false };
      }
    } catch (error) {
      console.warn('iOS Permission error:', error);
      return { granted: false, error };
    }
  }
};