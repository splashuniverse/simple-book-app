import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal} from 'react-native';
import {useLoadingStore} from '../store/LoadingStore';

const LoadingOverlay = () => {
  const isLoading = useLoadingStore(state => state.isLoading);
  const loadingCount = useLoadingStore(state => state.loadingCount);

  return (
    <Modal
      transparent
      visible={isLoading}
      animationType="fade"
      onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingOverlay;
