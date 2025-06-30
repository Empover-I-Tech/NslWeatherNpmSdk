import { Platform, Text, StatusBar, View, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import { translate } from '../../Localization/Localisation';
import CustomCircularProgress from '../../components/CustomCircularProgress';
import ApiConfig from '../../Networks/ApiConfig';
import ApiService from '../../Networks/ApiService';
import CustomHeaders from '../../components/CustomeHeaders';
import styles from './styles';
import { isNullOrEmptyNOTTrim } from '../../Utility/Utils';

const { height } = Dimensions.get("window")
const Remedyrecommendation = ({ route }) => {
  console.log("routesChecking=-=-=>", route.params)
  const [diseaseData, setDiseaseData] = useState(route?.params?.data || '')
  const [pests, setPests] = useState(route?.params?.data?.pests || '')
  const [description, setDescription] = useState(route?.params?.data?.description || '')
  const [cropName, setCropName] = useState(route?.params?.cropName || '');
  const navigation = useNavigation()
  const [diagnosis, setDiagnosis] = useState('');
  const [advisory, setAdvisory] = useState([]);
  const { isConnected } = useSelector(state => state.network);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getRedemy();
  }, [])

  const getRedemy = async () => {
    if (isConnected) {
      try {
        setTimeout(() => {
          setLoading(true);
        }, 50);

        const getRemedyUrl = ApiConfig.BASE_URL_NVM + ApiConfig.WEATHERDETAILS.getRemedies;
        const payload = {
          cropName: cropName,
          diseaseName: pests,
          latitude: route.params.latitude.toString(),
          longitude: route.params.longitude.toString(),
        };

        const finalResponse = await ApiService.post(getRemedyUrl, payload, false)
        if (finalResponse?.statusCode == 200) {
          setDiagnosis(finalResponse?.response[0]?.diagnosis);
          setAdvisory(finalResponse?.response[0]?.advisory);

        } else {
          SimpleToast.show(!isNullOrEmptyNOTTrim(finalResponse?.message) ? finalResponse?.message : translate('Something_went_wrong'));

        }
         setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Remedy API Error:', error);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } else {
       setTimeout(() => {
          setLoading(false);
        }, 1000);
    }
  };

  const handleBackScreen = () => {
    navigation.goBack()
  }

  return (
    <>
      <CustomHeaders backBtnHandle={handleBackScreen} headersTitle={translate("remedy_recommendation")} />
      <ScrollView>
        <View style={styles.remedyMainContainer}>
          <View style={styles.remedySubContainer}>
            <View style={{ width: "78%" }}>
              <Text style={styles.remedyNameText}>{pests}</Text>
              <Text style={styles.remedyDescription}>{description}</Text>
            </View>
            {diseaseData?.percentage && <CustomCircularProgress
              percentage={diseaseData?.percentage} radius={25} strokeWidth={6} percentageText={diseaseData?.percentage} level={diseaseData?.level}
            />}
          </View>
          <View style={styles.divider} />
          <View style={{ margin: 10 }}>
            <Text style={styles.dignosisText}>{diagnosis}</Text>
            <View style={{ maxHeight: height * 0.55 }}>
              {
                advisory?.length > 0 ? (
                  advisory?.map((item, index) => {
                    return (
                      <View style={styles.remedyPointsContainer}>
                        <Text style={styles.remedyPintsText}>{index + 1} </Text>
                        <Text style={styles.remedyPintsText}>{item?.point}</Text>
                      </View>
                    )
                  })
                )


                  : (
                    <Text style={styles.remedyNotAvailable}>{translate('not_available')}</Text>
                  )}
            </View>

          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Remedyrecommendation;
