import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {AppButton} from './Button';
import {BLEService} from './BLEService';
import {BleDevice} from './BleDevice/BleDevice';
import {cloneDeep} from './cloneDeep';

type DeviceExtendedByUpdateTime = Device & {updateTimestamp: number};

const MIN_TIME_BEFORE_UPDATE_IN_MILLISECONDS = 5000;

export function AppProvider() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [foundDevices, setFoundDevices] = useState<
    DeviceExtendedByUpdateTime[]
  >([]);

  const addFoundDevice = (device: Device) =>
    setFoundDevices(prevState => {
      if (!isFoundDeviceUpdateNecessary(prevState, device)) {
        return prevState;
      }
      // deep clone
      const nextState = cloneDeep(prevState);
      const extendedDevice: DeviceExtendedByUpdateTime = {
        ...device,
        updateTimestamp: Date.now() + MIN_TIME_BEFORE_UPDATE_IN_MILLISECONDS,
      } as DeviceExtendedByUpdateTime;

      const indexToReplace = nextState.findIndex(
        currentDevice => currentDevice.id === device.id,
      );
      if (indexToReplace === -1) {
        return nextState.concat(extendedDevice);
      }
      nextState[indexToReplace] = extendedDevice;
      return nextState;
    });

  const isFoundDeviceUpdateNecessary = (
    currentDevices: DeviceExtendedByUpdateTime[],
    updatedDevice: Device,
  ) => {
    const currentDevice = currentDevices.find(
      ({id}) => updatedDevice.id === id,
    );
    if (!currentDevice) {
      return true;
    }
    return currentDevice.updateTimestamp < Date.now();
  };

  const onConnectSuccess = () => {
    console.log('connected');
    setIsConnecting(false);
  };

  const onConnectFail = () => {
    setIsConnecting(false);
  };

  const deviceRender = (device: Device) => (
    <BleDevice
      onPress={pickedDevice => {
        setIsConnecting(true);
        BLEService.connectToDevice(pickedDevice.id)
          .then(onConnectSuccess)
          .catch(onConnectFail);
      }}
      key={device.id}
      device={device}
    />
  );

  return (
    <View style={{flex: 1, paddingHorizontal: 10}}>
      <AppButton
        label="Ask for permissions"
        onPress={BLEService.requestBluetoothPermission}
      />
      <AppButton
        label="Look for devices"
        onPress={() => {
          setFoundDevices([]);
          BLEService.initializeBLE().then(() =>
            BLEService.scanDevices(addFoundDevice, null, {legacyScan: true}),
          );
        }}
      />
      <AppButton
        label="Look for devices (legacy off)"
        onPress={() => {
          setFoundDevices([]);
          BLEService.initializeBLE().then(() =>
            BLEService.scanDevices(addFoundDevice, null, {legacyScan: false}),
          );
        }}
      />
      <FlatList
        style={{flex: 1}}
        data={foundDevices}
        renderItem={({item}) => deviceRender(item)}
        keyExtractor={device => device.id}
      />
    </View>
  );
}
