import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  // testID prop removed as it's not used
}

const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      style={[styles.input, props.style]}
      placeholderTextColor="#888"
      autoCapitalize="none"
      autoCorrect={false}
      testID={props.testID}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default Input;