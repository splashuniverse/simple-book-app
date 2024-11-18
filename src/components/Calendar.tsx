import React from 'react';
import {Calendar, CalendarProps, LocaleConfig} from 'react-native-calendars';
import {ContextProp} from 'react-native-calendars/src/types';

// Locale 설정을 통해 요일을 한국어로 변환
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const defaultCalendar = (
  props: CalendarProps & ContextProp,
): React.JSX.Element => {
  return <Calendar {...props} monthFormat="yyyy년 MM월" />;
};

export default defaultCalendar;
