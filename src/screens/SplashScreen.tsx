import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, StatusBar} from 'react-native';
import {Text} from '@rneui/themed';
import apiClient from '../utils/api';

const SplashScreen = () => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // 서버에서 스플래시 이미지 URL 가져오기
    const fetchSplashImage = async () => {
      try {
        const response = await apiClient.get('/server/splashimage'); // 서버 URL을 입력
        setImageUrl(response.data.url);
      } catch (error) {
        console.error('스플래시 이미지 로드 실패:', error);
      }
    };

    fetchSplashImage();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {imageUrl ? (
        <Image
          source={{uri: imageUrl}}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text>스플래시 이미지를 불러올 수 없습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default SplashScreen;
