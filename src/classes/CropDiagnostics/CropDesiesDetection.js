import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { translate } from '../../Localization/Localisation';
import { useNavigation } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import CustomHeaders from '../../components/CustomeHeaders';
import styles from './styles';

const CropDesiesDetection = ({ route }) => {
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState(null);
  const [diseaseName, setDiseaseName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advisory, setAdvisory] = useState([]);
  const viewShotRef = useRef(null);

  useEffect(() => {
    const data = route?.params?.data;
    let normalizedData = [];
    if (Array.isArray(data)) {
      normalizedData = data;
    } else if (typeof data === 'object' && data !== null) {
      normalizedData = [data];
    }
    const firstItem = normalizedData[0] || {};
    setImageUrl(firstItem.imageUrl || null);
    setDiseaseName(firstItem.diseaseName || '');
    setDiagnosis(firstItem.diagnosis || '');
    setAdvisory(Array.isArray(firstItem.advisory) ? firstItem.advisory : []);
  }, [route?.params?.data]);

  const shareProductDetails = async () => {
    const uri = await viewShotRef.current.capture();
    const shareOptions = {
      title: 'Share via',
      message: ``,
      url: uri,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Share Error:', error);
      }
    }
  };

  const handleBackScreen = () => {
    navigation.goBack()
  }

  return (
    <>
      <CustomHeaders backBtnHandle={handleBackScreen} headersTitle={translate("crop_disease_detection")} />
      <View style={styles.cropDiseasesDetection}>
        <ScrollView>
          <ViewShot ref={viewShotRef} style={styles.viewShotContainer} captureMode="mount" options={{ format: 'jpg', quality: 0.9 }} onCapture={(uri) => console.log("Auto-Captured URI:", uri)}>
            <View style={styles.viewShotSubContainer}>
              <Image source={{ uri: imageUrl }} style={styles.detectImage} />
              <View style={styles.detectSubCard}>
                <View style={styles.diseaseDetailsNameContainer}>
                  <View>
                    <Text style={styles.diseaseNameText}>{translate('disease_name')}</Text>
                    <Text style={styles.diseaseName}>{diseaseName || translate('not_available')}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.whatsappIconContainer}
                    onPress={() => shareProductDetails()}
                  >
                    <Image
                      source={require('../../assets/Images/whatsappkn.png')}
                      style={styles.whatsAppIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.dividerLine} />
                <Text style={styles.mostPossibleDiagnosisText}>{translate('most_possible_diagnosis')}</Text>
                <View style={styles.diagnosisTextContainer}>
                  <Text style={styles.diagnosisText}>{diagnosis || translate('not_available')}</Text>
                  {advisory.map((item, index) => {
                    return (
                      <View key={index.toString()} style={styles.diagnosisPointsContainer}>
                        <Text style={styles.diagnosisPointText}>{index + 1}. </Text>
                        <Text style={styles.diagnosisPointText}>{item.point}</Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            </View>
          </ViewShot>
        </ScrollView>
      </View>
    </>
  )
}

export default CropDesiesDetection