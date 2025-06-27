import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "../../colors/Colors";

const { width, height } = Dimensions.get('window');
// define your styles
export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        justifyContent : 'center'
    },
    topContainer: {
        width: "100%",
        height: 200,
        alignItems: 'center',
        backgroundColor: Colors.app_theme_color
    },
    halfCircle: {
        width: 120,
        height: 60, // half of width for a half circle
        backgroundColor: Colors.white_color,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        transform: [{ rotate: '180deg' }],
        position: 'absolute'
    },
    logo: {
        width: 60,
        height: 60,
        transform: [{ rotate: '180deg' }],
        alignSelf: 'center'
    },
    profileContainer: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'green',
        height: 100,
        width: "100%",
        top: 60
    },
    circleBackground: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: Colors.white_color, // decorative color
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#000',
    },
    greetingstText: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        color: Colors.white_color
    },
    smileIcon: {
        height: 15,
        width: 15,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginLeft: 5
    },
    userNameText: {
        fontWeight: '500',
        fontSize: 18,
        color: Colors.white_color
    },
    flexDirection_row: {
        flexDirection: 'row'
    }

});