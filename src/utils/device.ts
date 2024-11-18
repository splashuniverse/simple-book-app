import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const getDeviceInfo = () => {
  const carrierName = DeviceInfo.getCarrier();
  const abis = DeviceInfo.supportedAbisSync();

  return {
    os: Platform.OS,
    osVersion: String(Platform.Version),
    brand: DeviceInfo.getBrand(),
    model: DeviceInfo.getModel(),
    uid: DeviceInfo.getUniqueIdSync(),
    version: DeviceInfo.getVersion(),
    ipAddress: DeviceInfo.getIpAddressSync(),
    buildId: DeviceInfo.getBuildIdSync(),
    bundleId: DeviceInfo.getBundleId(),
    carrierName: typeof carrierName === 'string' ? carrierName : null,
    type: DeviceInfo.getDeviceType(),
    freeDiskStorage: DeviceInfo.getFreeDiskStorageSync(),
    firstInstallTime: DeviceInfo.getFirstInstallTimeSync(),
    emulator: DeviceInfo.isEmulatorSync(),
    abis: abis.join(','),
  };
};

export const getAppVersion = () => {
  return DeviceInfo.getVersion();
};
