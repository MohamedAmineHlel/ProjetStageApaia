import React, { useState ,useEffect} from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet ,TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleForgotPassword = () => {
    axios.post('http://192.168.1.13:5000/forgot-password', { email })
    .then(response => {
      Alert.alert('Success', 'An email with your new password has been sent.');
      navigation.goBack();  // Retourner à l'écran de connexion
    })
    .catch(error => {
      Alert.alert('ERROR', error.response.data.error || 'An error occurred while resetting your password.');
    });
  };
  useEffect(() => {
    // Hide the header when this screen is mounted
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
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.soutitle}>An email containing the new password will be sent if the email exists in the database.</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Réinitialiser" onPress={handleForgotPassword} color= '#008080'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#1c1c1c',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#008080',
  },
  soutitle: {
    fontSize: 10,
    marginBottom: 20,
    textAlign: 'center',
    color: '#white',
  },
  input: {
    height: 40,
    borderColor: '#008080',
    backgroundColor: '#008080',

    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  backButton: {
    color: '#008080', // Color for the back button
    position: 'absolute',
    top: 40, // Adjust as needed
    left: 20, // Adjust as needed
    backgroundColor: '008080',
  },
});
