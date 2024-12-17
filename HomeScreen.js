import React, { useState, useLayoutEffect , useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Icon name="home" size={24} color="black" />
          <Text style={styles.headerTitle}>Home</Text>
        </View>
      ),
    });
  }, [navigation]);

  const validateFields = () => {
    if (!name || !surname || !day || !month || !year || !sex || !medicalHistory) {
      Alert.alert('Tous les champs doivent être remplis');
      return true;
    }
    return true;
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission d\'accès à l\'enregistrement audio refusée');
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      setIsPaused(false);

      const id = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    } catch (err) {
      console.error('Échec du démarrage de l\'enregistrement', err);
    }
  };

  const pauseRecording = async () => {
    try {
      if (recording && !isPaused) {
        await recording.pauseAsync();
        setIsPaused(true);
        clearInterval(intervalId);
      } else if (recording && isPaused) {
        await recording.startAsync();
        setIsPaused(false);
        const id = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
        setIntervalId(id);
      }
    } catch (err) {
      console.error('Échec de la pause/reprise de l\'enregistrement', err);
    }
  };

  const stopRecording = async () => {
    if (!validateFields()) return;
  
    try {
      setRecording(null);
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Enregistrement arrêté et stocké à', uri);
  
        const fileInfo = await FileSystem.getInfoAsync(uri);
        const newUri = FileSystem.documentDirectory + fileInfo.uri.split('/').pop().replace('.m4a', '.wav');
        await FileSystem.moveAsync({
          from: uri,
          to: newUri
        });
        console.log('Enregistrement sauvegardé à', newUri);
        setRecordedUri(newUri);
  
        navigation.navigate('Save', { recordedUri: newUri, name, surname, day, month, year, weight, sex, medicalHistory });
      }
  
      clearInterval(intervalId);
      setRecordingDuration(0);
    } catch (err) {
      console.error('Échec de l\'arrêt de l\'enregistrement', err);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  useEffect(() => {
    // Hide the header when this screen is mounted
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLogout = () => {
   
    
    navigation.navigate('Login');
  };
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
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
         <View style={styles.logoutContent}>
          
          <Text style={styles.logoutText}>Logout  <Icon name="sign-out" size={24} color="red" /></Text>
        </View>
        
      </TouchableOpacity>
      <Image 
        style={styles.image}
        source={require('./assets/big_logo.png')} // Correct path to the local image
      />
      <Text style={styles.title}>Medical Consultation</Text>
      
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
      <View style={styles.dateContainer}>
        <TextInput
          style={styles.dateInput}
          placeholder="Day"
          value={day}
          onChangeText={setDay}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="Month"
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="Year"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <View style={styles.radioContainer}>
        <Text style={styles.gender}>Gender:</Text>
        <View style={styles.radioGroup}>
          <RadioButton
            value="Female"
            status={sex === 'Female' ? 'checked' : 'unchecked'}
            onPress={() => setSex('Female')}
          />
          <Text style={styles.gender}>Female</Text>
        </View>
        <View style={styles.radioGroup}>
          <RadioButton
            value="Male"
            status={sex === 'Male' ? 'checked' : 'unchecked'}
            onPress={() => setSex('Male')}
          />
          <Text style={styles.gender}>Male</Text>
        </View>
      </View>
      <TextInput
        style={styles.textArea}
        placeholder="Medical history"
        value={medicalHistory}
        onChangeText={setMedicalHistory}
        multiline={true}
        numberOfLines={4}
      />
      <View style={styles.recordContainer}>
        <TouchableOpacity onPress={startRecording} disabled={!!recording}>
          <Icon name="microphone" size={40} color={recording ? "white" : "red"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={pauseRecording} disabled={!recording}>
          <Icon name="pause" size={40} color={recording ? "#008080" : "gray"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={stopRecording} disabled={!recording}>
          <Icon name="stop" size={40} color={recording ? "#008080" : "gray"} />
        </TouchableOpacity>
      </View>
      {recording && <Text style={styles.timer}>{formatTime(recordingDuration)}</Text>}

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c', // Dark background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    marginLeft: 10,
    color:'#008080'
  },
  title: {
    color:'#508080',
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#008080',
    backgroundColor:'#fff',
    color:'#008080',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },

  dateContainer: {
    color:'#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  dateInput: {
    backgroundColor:'#fff',
    color:'#008080',
    width: '30%',
    height: 40,
    borderColor: '#008080',
    borderWidth: 1,
    padding: 10,
  },
  textArea: {
    backgroundColor:'#fff',
    color:'#008080',
    width: '100%',
    height: 80,
    borderColor: '#008080',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  gender:{
    color:'#fff'
  },
  radioContainer: {
    
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioGroup: {
    
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  recordContainer: {
    
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  timer: {
    marginTop: 10,
    fontSize: 20,
    color: '#008080',

  },
  button: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#008080',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute', // Position the logout button absolutely
    top: 40, // Adjust the top position
    right: 20, // Adjust the left position
    backgroundColor: 'transparent', // Make the background transparent
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center', // Align icon and text vertically
  },
  logoutText: {
    color: '#ff0000', // Color for the logout text
    fontSize: 16, // Font size for the logout text
    marginLeft: 8, // Add space between icon and text
  },
  backButton: {
    color: '#008080', // Color for the back button
    position: 'absolute',
    top: 40, // Adjust as needed
    left: 20, // Adjust as needed
    backgroundColor: '008080',
  },
});
