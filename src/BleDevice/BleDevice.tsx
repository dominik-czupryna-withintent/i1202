import React from 'react';
import {Device} from 'react-native-ble-plx';
import {DeviceProperty} from './DeviceProperty/DeviceProperty';
import {TouchableOpacity} from 'react-native';

export type BleDeviceProps = {
  onPress: (device: Device) => void;
  device: Device;
};

export function BleDevice({device, onPress}: BleDeviceProps) {
  const isConnectableInfoValueIsUnavailable =
    typeof device.isConnectable !== 'boolean';
  const isConnectableValue = device.isConnectable ? 'true' : 'false';
  const parsedIsConnectable = isConnectableInfoValueIsUnavailable
    ? '-'
    : isConnectableValue;

  console.log(device.id);
  return (
    <TouchableOpacity
      style={{
        borderColor: 'red',
        borderWidth: 1,
        padding: 12,
        borderRadius: 12,
        marginTop: 12,
      }}
      onPress={() => onPress(device)}>
      <DeviceProperty name="name" value={device.name} />
      <DeviceProperty name="localName" value={device.localName} />
      <DeviceProperty name="id" value={device.id} />
      <DeviceProperty name="manufacturerData" value={device.manufacturerData} />
      <DeviceProperty name="rawScanRecord" value={device.rawScanRecord} />
      <DeviceProperty name="isConnectable" value={parsedIsConnectable} />
      <DeviceProperty name="mtu" value={device.mtu.toString()} />
      <DeviceProperty name="rssi" value={device.rssi} />
    </TouchableOpacity>
  );
}
