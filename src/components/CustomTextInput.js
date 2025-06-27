import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const CustomTextInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    secureTextEntry = false,
    editable = true,
    multiline = false,
    numberOfLines = 1,
    style = {},
    type = '', // 'mobile', 'email', etc.
    maxLength,
    rightIcon = null,
    onPressRightIcon = null
}) => {
    const handleTextChange = (text) => {
        if (type === 'mobile') {
            const cleaned = text.replace(/[^0-9]/g, '');
            if (cleaned.length <= 10 && (cleaned.length === 0 || /^[6-9]/.test(cleaned))) {
                onChangeText(cleaned);
            }
        } else if (type === 'email') {
            const allowed = text.replace(/[^a-zA-Z0-9@._-]/g, '');
            onChangeText(allowed);
        } else {
            onChangeText(text);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <View style={[styles.inputWrapper, multiline && { height: 'auto', minHeight: 100 }]}>
                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.multilineInput,
                        { flex: 1 },
                        style
                    ]}
                    value={value}
                    onChangeText={handleTextChange}
                    placeholder={placeholder}
                    keyboardType={type === 'mobile' ? 'numeric' : keyboardType}
                    secureTextEntry={secureTextEntry}
                    editable={editable}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    placeholderTextColor="#999"
                    textAlignVertical={multiline ? 'top' : 'center'}
                    maxLength={maxLength}
                />

                {rightIcon && (
                    <TouchableOpacity
                        onPress={onPressRightIcon}
                        style={styles.iconWrapper}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.icon}>{rightIcon}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 5,
        width: '100%'
    },
    label: {
        marginBottom: 4,
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    inputWrapper: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    input: {
        fontSize: 14,
        color: '#000',
        padding: 0,
        margin: 0,
    },
    multilineInput: {
        minHeight: 100,
    },
    iconWrapper: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 8,
        paddingTop: 4,
    },
    icon: {
        fontSize: 18,
        color: '#514A94',
    }
});

export default CustomTextInput;
