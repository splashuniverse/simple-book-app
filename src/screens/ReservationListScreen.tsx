import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Calendar from '../components/Calendar';
import {useReservationStore} from '../store/ReservationStore';
import {useFocusEffect} from '@react-navigation/native';
import {RESERVATION_STATUS} from '../enums/enums';
import {format, parseISO} from 'date-fns';
import {toZonedTime} from 'date-fns-tz';
import WebView from 'react-native-webview';
import {ReservationListScreenProp} from '../types/navigationType';
import {SCREEN_TITLES} from '../constants/navigationConstants';
import {useLoadingStore} from '../store/LoadingStore';
import {formatDateToString} from '../utils/common';
import cloneDeep from 'lodash/cloneDeep';
import {Text} from '@rneui/themed';

const timeZone = 'Asia/Seoul';

const ReservationListScreen = ({
  navigation,
}: ReservationListScreenProp): React.JSX.Element => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const {
    reservations,
    markedDates,
    fetchReservations,
    requestReservation,
    cancelReservation,
    resetReservation,
  } = useReservationStore();
  const {isLoading} = useLoadingStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filteredReservations, setFilteredReservations] =
    useState(reservations);
  const [webviewVisible, setWebviewVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  // 캘린더
  const today = formatDateToString(new Date(), 'yyyy-MM-dd');
  const selectedProp = {
    selected: true,
    marked: false,
    selectedColor: '#D3D3D3',
  };
  const [markDate, setMarkDate] = useState({
    [today]: selectedProp,
  });

  const requestList = async () => {
    await fetchReservations();
  };

  useFocusEffect(
    // 포커스될 때 한 번만 호출
    useCallback(() => {
      requestList();

      return () => {
        resetReservation();
        setFilteredReservations([]);
        setMarkDate({
          [today]: selectedProp,
        });
        setReviewModalVisible(false);
        setSelectedPlaceId(null);
      };
    }, []),
  );

  useEffect(() => {
    // reservations 상태가 변경될 때 filteredReservations를 업데이트
    setFilteredReservations(reservations);

    // 필요한 추가 작업
    markDates();
    const completedReservation = reservations.find(
      reservation =>
        reservation.reservationStatus === RESERVATION_STATUS.COMPLETED &&
        !reservation.isWriteReview,
    );

    if (completedReservation) {
      setSelectedPlaceId(completedReservation.id);
      setReviewModalVisible(true);
    }
  }, [reservations]);

  const onRefresh = async () => {
    setRefreshing(true);
    await requestList();
    setRefreshing(false);
  };

  const markDates = () => {
    const dates = markedDates.reduce(
      (acc, item) => {
        if (acc[item]) {
          acc = {
            ...acc,
            [item]: {
              ...acc[item],
              marked: true,
              selectedColor: '#D3D3D3',
            },
          };
        } else {
          acc = {
            ...acc,
            [item]: {
              selected: false,
              marked: true,
              selectedColor: '#D3D3D3',
            },
          };
        }

        return acc;
      },
      {
        ...markDate,
      },
    );
    setMarkDate(dates);
  };

  const onDayPress = (day: any) => {
    const data = cloneDeep(markDate);
    if (!data[day.dateString]) {
      data[day.dateString] = {
        selected: false,
        marked: false,
        selectedColor: '#D3D3D3',
      };
    }

    for (const key in data) {
      data[key].selected = key === day.dateString;
    }

    setMarkDate(data);

    const filtered = reservations.filter(
      item =>
        format(toZonedTime(item.startDate, timeZone), 'yyyy-MM-dd') ===
        day.dateString,
    );

    setFilteredReservations(filtered);
  };

  const handleRequestReservation = async (placeId: number) => {
    await requestReservation(placeId);
    await requestList();
  };

  const handleCancelReservation = async (reservationId: number) => {
    await cancelReservation(reservationId);
    await requestList();
  };

  const renderItem = ({item}: {item: any}) => {
    const isCancelled = item.reservationStatus === RESERVATION_STATUS.CANCEL;

    return (
      <View style={styles.reservationItem}>
        <Text style={styles.reservationTime}>
          {item.reservationStatus || '예약 없음'}
        </Text>
        <View style={styles.reservationDetails}>
          <Text
            style={[
              styles.reservationTitle,
              isCancelled && styles.strikethrough,
            ]}>
            {item.name}
          </Text>
          <Text
            style={[
              styles.reservationDescription,
              isCancelled && styles.strikethrough,
            ]}>
            {item.address1}
          </Text>
        </View>
        {!item.reservationId && (
          <TouchableOpacity
            style={[styles.button, styles.requestButton]}
            onPress={() => handleRequestReservation(item.id)}
            disabled={isLoading} // 로딩 중인 경우 비활성화
          >
            <Text style={styles.buttonText}>예약요청</Text>
          </TouchableOpacity>
        )}
        {item.reservationId &&
          RESERVATION_STATUS.REQUESTED === item.reservationStatus && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => handleCancelReservation(item.reservationId)}
              disabled={isLoading || isCancelled} // 로딩 중이거나 취소된 경우 비활성화
            >
              <Text style={styles.buttonText}>예약취소</Text>
            </TouchableOpacity>
          )}
        {item.reservationId &&
          RESERVATION_STATUS.APPROVED === item.reservationStatus && (
            <Text>예약승인</Text>
          )}
        {item.reservationId &&
          RESERVATION_STATUS.REJECT === item.reservationStatus && (
            <Text>예약거절</Text>
          )}
        {item.reservationId &&
          RESERVATION_STATUS.WAITING === item.reservationStatus && (
            <TouchableOpacity
              style={[styles.button, styles.requestButton]}
              onPress={() => {
                setQrUrl(item.reservationQrUrl);
                setWebviewVisible(!webviewVisible);
              }}
              disabled={isLoading}>
              <Text>QR 인증</Text>
            </TouchableOpacity>
          )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        markedDates={markDate}
        onDayPress={onDayPress}
      />
      <FlatList
        data={filteredReservations}
        keyExtractor={(item, index) =>
          item.reservationId?.toString() || `${item.id}-${index}`
        }
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={webviewVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setWebviewVisible(!webviewVisible)}>
        <View style={styles.modalContainer}>
          <View style={styles.webviewWrapper}>
            <WebView source={{uri: qrUrl}} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setWebviewVisible(!webviewVisible)}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={reviewModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setReviewModalVisible(false)}>
        <View style={styles.reviewModalContainer}>
          <View style={styles.reviewModalContent}>
            <Text style={styles.reviewModalText}>리뷰를 작성해 주세요!</Text>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => {
                setReviewModalVisible(false);
                if (selectedPlaceId) {
                  // 리뷰 작성 페이지로 이동
                  navigation.navigate(SCREEN_TITLES.REVIEW_WRITE, {
                    placeId: selectedPlaceId,
                  });
                }
              }}>
              <Text style={styles.reviewButtonText}>리뷰 작성하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setReviewModalVisible(false)}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  calendar: {
    marginBottom: 10,
  },
  reservationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  reservationTime: {
    fontSize: 16,
    color: '#b58ddc',
    width: '20%',
  },
  reservationDetails: {
    width: '50%',
  },
  reservationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reservationDescription: {
    fontSize: 14,
    color: '#666',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButton: {
    backgroundColor: '#32cd32',
  },
  cancelButton: {
    backgroundColor: '#ff6347',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewWrapper: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#ff6347',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
  },

  reviewModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewModalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  reviewModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  reviewButton: {
    backgroundColor: '#32cd32',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  // closeButton: {
  //   backgroundColor: '#ff6347',
  //   padding: 10,
  //   borderRadius: 5,
  // },
  // closeButtonText: {
  //   color: '#fff',
  //   fontSize: 16,
  // },
});

export default ReservationListScreen;
