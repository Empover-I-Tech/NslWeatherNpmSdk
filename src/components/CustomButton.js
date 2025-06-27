import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Colors } from '../colors/Colors';

const CustomButton = ({
    btnWidth = '100%',
    btnHeight = 48,
    btnRadius = 6,
    btnText = 'Click',
    btnColor = Colors.app_theme_color, // Your theme color
    textColor = '#FFFFFF',
    borderColor = Colors.app_theme_color,
    borderWidth = 0,
    fontSize = 16,
    marginTop = 5,
    onPress = () => { }
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: btnWidth,
                height: btnHeight,
                backgroundColor: btnColor,
                borderRadius: btnRadius,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: borderColor,
                borderWidth: borderWidth,
                marginTop : marginTop
            }}
        >
            <Text style={{ color: textColor, fontSize: fontSize, fontWeight : "bold" }}>{btnText}</Text>
        </TouchableOpacity>
    );
};

export default CustomButton;
