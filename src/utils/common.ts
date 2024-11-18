import {formatInTimeZone} from 'date-fns-tz';
import {DEFAULT_TIME_ZONE} from '../constants/commonConstants';

export const formatDateToString = (
  date: Date,
  format: string,
  timezone: string = DEFAULT_TIME_ZONE,
) => {
  return formatInTimeZone(date, timezone, format);
};

export const compareVersions = (version1: string, version2: string): number => {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1 = v1Parts[i] || 0; // 해당 부분이 없을 경우 0으로 비교
    const v2 = v2Parts[i] || 0;

    if (v1 > v2) return 1; // version1이 더 크면 1 반환
    if (v1 < v2) return -1; // version2가 더 크면 -1 반환
  }

  return 0; // 같으면 0 반환
};
