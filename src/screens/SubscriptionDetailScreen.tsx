import React, {useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SubscriptionDetailScreenProp} from '../types/navigationType';
import {useSubscriptionStore} from '../store/SubscriptionStore';
import {AirbnbRating, Card, Divider, Text} from '@rneui/themed';
import {ScrollView} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const SubscriptionDetailScreen = ({
  navigation,
  route,
}: SubscriptionDetailScreenProp) => {
  const {subscriptionDetail, fetchSubscriptionDetail, resetSubscriptionDetail} =
    useSubscriptionStore();

  const attachments =
    subscriptionDetail?.places?.reduce(
      (acc: any, item: any) => [...acc, ...item.attachments],
      [],
    ) || [];
  const reviews =
    subscriptionDetail?.places?.reduce(
      (acc: any, item: any) => [...acc, ...item.reviews],
      [],
    ) || [];
  const avgReviewRating = reviews.length
    ? Math.round(
        reviews.reduce((acc: any, item: any) => (acc += item.rating), 0) /
          reviews.length,
      )
    : 0;

  useFocusEffect(
    useCallback(() => {
      fetchSubscriptionDetail(route.params.partnerId);

      return () => {
        resetSubscriptionDetail();
      };
    }, []),
  );

  // 탭 스크린 정의
  const InfoScreen = () => (
    <View style={styles.tabContent}>
      <Card containerStyle={styles.infoCard}>
        <Card.Title style={styles.cardTitle}>
          {subscriptionDetail.partnerName}
        </Card.Title>
        <Card.Divider />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>카테고리:</Text>
          <Text style={styles.infoText}>
            {subscriptionDetail?.category || ''}
          </Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>소개:</Text>
          <Text style={styles.infoText}>
            {subscriptionDetail?.introduction || ''}
          </Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>매니저:</Text>
          <Text style={styles.infoText}>
            {subscriptionDetail?.managerName || ''}
          </Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>연락처:</Text>
          <Text style={styles.infoText}>
            {subscriptionDetail?.managerPhoneNumber || ''}
          </Text>
        </View>
      </Card>

      <ScrollView style={{marginTop: 20}}>
        {subscriptionDetail?.places &&
          subscriptionDetail.places.map((item: any) => (
            <Card key={item.id}>
              <Card.Title>{item.name}</Card.Title>
              <Card.Divider />
              <View style={{paddingVertical: 5}}>
                <Text>
                  {item.address1}, {item.address2}
                </Text>
                <Text style={{marginTop: 10}}>{item.content}</Text>
              </View>
            </Card>
          ))}
      </ScrollView>
    </View>
  );

  const GalleryScreen = () => (
    <ScrollView contentContainerStyle={styles.galleryContent}>
      {attachments.map((item: any, index: number) => (
        <View
          key={item.id}
          style={[
            styles.galleryItem,
            index % 2 !== 0 && {marginLeft: 10}, // 두 번째 아이템에만 왼쪽 여백 추가
          ]}>
          <Card containerStyle={styles.card}>
            <Card.Image source={{uri: item.url}} style={styles.galleryImage} />
          </Card>
        </View>
      ))}
    </ScrollView>
  );

  const ReviewsScreen = () => (
    <View style={styles.tabContent}>
      <Text>Average Rating: {avgReviewRating}</Text>
      <AirbnbRating
        size={20}
        count={5}
        defaultRating={avgReviewRating}
        reviews={[]}
        isDisabled={true}
      />
      <ScrollView>
        {reviews.map((item: any) => (
          <Card key={item.id} containerStyle={styles.reviewCard}>
            <Card.Title>Rating: {item.rating}</Card.Title>
            <Card.Divider />
            <Text>{item.content}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Tab.Navigator>
        <Tab.Screen name="정보" component={InfoScreen} />
        <Tab.Screen name="갤러리" component={GalleryScreen} />
        <Tab.Screen name="리뷰" component={ReviewsScreen} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
  card: {
    borderRadius: 8,
  },
  rating: {
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  reviewCard: {
    borderRadius: 8,
    marginBottom: 10,
  },
  infoCard: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#444',
  },
  infoText: {
    color: '#666',
    flexShrink: 1,
    textAlign: 'right',
  },
  divider: {
    marginVertical: 5,
  },
  galleryContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  galleryItem: {
    width: '48%', // 한 행에 두 개의 이미지가 나오도록 설정
    marginBottom: 10,
  },
  galleryImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
});

export default SubscriptionDetailScreen;
