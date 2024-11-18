import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Text} from '@rneui/themed';
import {Rating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import apiClient from '../utils/api';
import {getTokens} from '../utils/keychain';

const ReviewScreen = ({route}: any) => {
  const {placeId} = route.params;
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const navigation = useNavigation();

  // 리뷰 제출 함수
  const submitReview = async () => {
    try {
      if (!rating || !content) {
        Alert.alert('평점과 리뷰 내용을 입력해주세요.');
        return;
      }

      const token = await getTokens();

      if (!token) {
        throw '토큰이 없습니다.';
      }

      // 서버에 리뷰 제출
      await apiClient.post(
        `/place/${placeId}/review`,
        {
          rating,
          content,
        },
        {
          headers: {
            Version: 'v1',
            authorization: `Bearer ${token.accessToken}`,
          },
        },
      );

      Alert.alert('리뷰가 성공적으로 제출되었습니다.');
      navigation.goBack(); // 이전 화면으로 이동
    } catch (error) {
      console.error('리뷰 제출 오류:', error);
      Alert.alert('리뷰 제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>리뷰 작성</Text>
      <Rating
        startingValue={0}
        imageSize={30}
        onFinishRating={(value: any) => setRating(value)}
        style={styles.rating}
      />
      <TextInput
        style={styles.textInput}
        placeholder="리뷰 내용을 입력해주세요."
        multiline
        value={content}
        onChangeText={text => setContent(text)}
      />
      <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
        <Text style={styles.submitButtonText}>제출하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rating: {
    marginBottom: 20,
  },
  textInput: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#32cd32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewScreen;
