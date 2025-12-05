import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { validateEmail, validatePassword } from '../utils/validation';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type AuthNavigationProp = NavigationProp<Record<string, object | undefined>>;

export const SignUpScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      
      if (!validateEmail(formData.email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        setLoading(false);
        return;
      }
      
      if (!validatePassword(formData.password)) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        setLoading(false);
        return;
      }

      await signUp(formData.email, formData.password);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Sign Up Failed', (error as Error).message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        value={formData.email}
        onChangeText={value => handleChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      
      <Input
        label="Password"
        value={formData.password}
        onChangeText={value => handleChange('password', value)}
        secureTextEntry
        autoCapitalize="none"
      />
      
      <Input
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={value => handleChange('confirmPassword', value)}
        secureTextEntry
        autoCapitalize="none"
      />
      
      <Button 
        title="Sign Up" 
        onPress={handleSignUp} 
        loading={loading}
        disabled={loading}
      />
      
      <Button 
        title="Back to Login" 
        onPress={() => navigation.goBack()} 
        variant="outline"
        style={styles.backButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    marginTop: 10,
  },
});