import React from 'react';
import type {TouchableOpacityProps} from 'react-native';
import {Text, TouchableOpacity} from 'react-native';

export type AppButtonProps = TouchableOpacityProps & {
  label: string;
};

export function AppButton({label, ...props}: AppButtonProps) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'red',
        margin: 10,
        padding: 12,
        alignItems: 'center',
        borderRadius: 100,
      }}
      {...props}>
      <Text style={{color: 'white'}}>{label}</Text>
    </TouchableOpacity>
  );
}
