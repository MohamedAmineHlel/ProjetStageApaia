import React, { useState ,useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateBirthdate = (birthdate) => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    return re.test(birthdate);
  };

  const handleSignup = () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (!validateBirthdate(birthdate)) {
      Alert.alert('Error', 'Please enter a valid birthdate in the format YYYY-MM-DD.');
      return;
    }

    axios.post('http://192.168.1.13:5000/signup', {
      name,
      surname,
      email,
      specialty,
      password,
      birthdate
    })
    .then(response => {
      Alert.alert('Success', response.data.message);
      navigation.navigate('Login');
    })
    .catch(error => {
      Alert.alert('Error', error.response.data.error || 'An error occurred');
    });
  };

  useEffect(() => {
    // Hide the header when this screen is mounted ,
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBack}
      >
        <Icon name="arrow-left" size={24} color="#008080" />
      </TouchableOpacity>
     
      <Text style={styles.title}>Doctor Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Specialty"
        value={specialty}
        onChangeText={setSpecialty}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Birthdate (YYYY-MM-DD)"
        value={birthdate}
        onChangeText={setBirthdate}
      />
      <Button title="Sign Up" onPress={handleSignup} color='#008080'/>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#1C1C1C',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#008080',

  },
  input: {
    height: 40,
    borderColor: '#008080',
    color:'#008080',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    shadowColor:'#008080',
    placeholder:'#008080',
    backgroundColor:'#fff'
  },
  loginText: {
    marginTop: 20,
    fontSize: 16,
    color: '#008080',
    textAlign: 'center',
  },
  backButton: {
    color: '#008080', // Color for the back button
    position: 'absolute',
    top: 40, // Adjust as needed
    left: 20, // Adjust as needed
    backgroundColor: '008080',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
