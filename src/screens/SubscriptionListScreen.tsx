import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Badge, Divider, Text} from '@rneui/themed';
import {useSubscriptionStore} from '../store/SubscriptionStore';
import {SubscriptionListScreenProp} from '../types/navigationType';
import {SCREEN_TITLES} from '../constants/navigationConstants';
import {useFocusEffect} from '@react-navigation/native';
import {Button} from '@rneui/base';

const SubscriptionListScreen = ({
  navigation,
  route,
}: SubscriptionListScreenProp) => {
  const {
    subscriptions,
    fetchSubscriptions,
    subscribe,
    unsubscribe,
    resetSubscriptions,
  } = useSubscriptionStore();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchSubscriptions(route?.params?.isUserSubscription); // 첫 페이지 구독 리스트 요청

      return () => {
        resetSubscriptions();
      };
    }, []),
  );

  // 새로고침 핸들러
  const onRefresh = async () => {
    setRefreshing(true); // 로딩 상태를 활성화
    await fetchSubscriptions(route?.params?.isUserSubscription); // API 요청
    setRefreshing(false); // 로딩 상태 비활성화
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={subscriptions}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(SCREEN_TITLES.SUBSCRIPTION_DETAIL, {
                partnerId: item.id,
              })
            }>
            <View style={styles.subscriptionItem}>
              <Badge
                value={item.category}
                status="primary"
                containerStyle={{padding: 10}}
                textStyle={{fontSize: 15, color: '#FFFFFF'}}
                badgeStyle={{
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 10, // 높이를 늘리기 위해 수직 패딩 증가
                  minHeight: 40, // 최소 높이 설정
                }}
              />
              <Divider
                orientation="vertical"
                width={1}
                style={styles.divider}
              />
              <View style={styles.partnerInfo}>
                <Text style={styles.partnerName}>{item.partnerName}</Text>
                <Text>{item.introduction}</Text>
              </View>

              {item.isSubscribed ? (
                <Button
                  style={styles.subscribeButton}
                  onPress={async () => await unsubscribe([item.id])}>
                  구독취소
                </Button>
              ) : (
                <Button
                  style={styles.subscribeButton}
                  onPress={async () => await subscribe([item.id])}>
                  구독
                </Button>
              )}
            </View>
          </TouchableOpacity>
        )}
        initialNumToRender={10}
        refreshing={refreshing} // 로딩 상태를 FlatList에 전달
        onRefresh={onRefresh} // 새로고침 핸들러 등록
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subscriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  divider: {
    flex: 0,
    marginHorizontal: 8,
  },
  partnerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscribeButton: {
    width: 100,
  },
});

export default SubscriptionListScreen;
