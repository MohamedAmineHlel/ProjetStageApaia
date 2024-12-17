import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,Image } from 'react-native';
import axios from 'axios';
export default function LoginScreen({ navigation }) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  const handleLogin = () => {
    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide.');
      return;
    }

    axios.post('http://192.168.1.13:5000/login', {
      email,
      password
    })
    .then(response => {
      //Alert.alert('Succès', response.data.message);
      // Navigate to home screen or dashboard after login
      navigation.navigate('Splash');
    })
    .catch(error => {
      Alert.alert('Erreur', error.response.data.error || 'Une erreur s\'est produite');
    });
  };
  const handleSignUp = () => {
    // Navigate to Sign Up screen
    navigation.navigate('Signup'); // Adjust the name based on your navigation setup
  };

  const handleResetPassword = () => {
    // Navigate to Reset Password screen
    navigation.navigate('ForgotPassword'); // Adjust the name based on your navigation setup
  };

  useEffect(() => {
    // Hide the header when this screen is mounted
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        source={require('./assets/big_logo.png')} // Correct path to the local image
      />
      <Text style={styles.title}>WELCOME BACK</Text>

      <Text style={styles.loginText}>LOGIN IN</Text>

      <TextInput
        style={styles.input}
        placeholder="USER NAME"
        value={email}
        onChangeText={setEmail}
         keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOGIN IN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkButton} onPress={handleResetPassword}>
        <Text style={styles.linkButtonText}>Reset Password</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>OR REGISTER IN OUR APP</Text>

      <View style={styles.socialIconsContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={handleSignUp}>
          <Text style={styles.socialIcon}>Sign Up</Text>
        </TouchableOpacity>
      
      </View>

 

   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c', // Dark background
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 50,
  },
  loginText: {
    fontSize: 20,
    color: '#008080',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',

    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 30,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 20,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  socialButton: {
    width: 80,
    height: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  socialIcon: {
    color: '#FFF',
    fontSize: 18,
  },
  linkButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  linkButtonText: {
    color: '#008080',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
