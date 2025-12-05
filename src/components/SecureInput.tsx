import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';

interface SecureInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: object;
}

const SecureInput: React.FC<SecureInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Enter secure text',
  style,
}) => {
  const [isSecure, setIsSecure] = useState(true);
  const { colors } = useTheme();

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={isSecure}
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholderTextColor={colors.text + '80'}
      />
      <TouchableOpacity onPress={toggleSecureEntry} style={styles.iconContainer}>
        <Icon
          name={isSecure ? 'visibility-off' : 'visibility'}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  iconContainer: {
    padding: 4,
  },
});

export default SecureInput;
