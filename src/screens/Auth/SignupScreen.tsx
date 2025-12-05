import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ThunkDispatch } from '@reduxjs/toolkit';

import { authActions } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { validateEmail, validatePassword } from '../../utils/validation';
import { AppDispatch } from '../../store';
import { AuthNavigationProp } from '../../types/navigation';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ScreenContainer from '../../components/common/ScreenContainer';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<AuthNavigationProp>();

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.signUp(email, password);
      dispatch(authActions.setUser(user));
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.formContainer}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        
        <Button 
          title="Sign Up" 
          onPress={handleSignup} 
          loading={loading}
          style={styles.button}
        />
        
        <Button 
          title="Already have an account? Sign In" 
          onPress={() => navigation.navigate('Login')}
          variant="outline"
          style={styles.linkButton}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 20,
  },
  linkButton: {
    marginTop: 10,
  },
});

export default SignupScreen;
