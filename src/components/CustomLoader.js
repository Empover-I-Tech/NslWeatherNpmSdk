// src/components/CustomLoader.js

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const CustomLoader = ({ visible = false, backgroundColor = 'rgba(0,0,0,0.3)', loaderColor = '#845EF1', size = 'large' }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor }]}>
        <ActivityIndicator size={size} color={loaderColor} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CustomLoader;
