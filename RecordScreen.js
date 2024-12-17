import React, { useState, useLayoutEffect , useEffect}  from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function RecordScreen({ navigation, route }) {
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

  // Use useEffect to fill the form with patient data
  useEffect(() => {
    if (route.params) {
      const { name, surname, day, month, year, weight, sex, medicalHistory } = route.params;
      setName(name);
      setSurname(surname);
      setDay(day);
      setMonth(month);
      setYear(year);
      setWeight(weight);
      setSex(sex);
      setMedicalHistory(medicalHistory);
    }
  }, [route.params]);

  const validateFields = () => {
    if (!name || !surname || !day || !month || !year || !sex || !medicalHistory) {
      Alert.alert('Tous les champs doivent être remplis');
      return false; 
    }
    return true;
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission d'accès à l'enregistrement audio refusée");
        return;
      }

      // If a recording is already in progress, return
      if (recording) {
        console.log("Recording already in progress.");
        return; // Prevent starting a new recording
      }

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsPaused(false);
      setRecordingDuration(0); // Reset duration

      const id = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
      console.log("Recording started.");
    } catch (err) {
      console.error("Échec du démarrage de l'enregistrement", err);
    }
  };
  useEffect(() => {
    // Hide the header when this screen is mounted
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const stopRecording = async () => {
    if (!validateFields()) return;

    try {
      if (recording) {
        setRecording(null);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Enregistrement arrêté et stocké à", uri);

        const fileInfo = await FileSystem.getInfoAsync(uri);
        const newUri = FileSystem.documentDirectory + fileInfo.uri.split('/').pop().replace('.m4a', '.wav');
        await FileSystem.moveAsync({
          from: uri,
          to: newUri,
        });
        console.log("Enregistrement sauvegardé à", newUri);
        setRecordedUri(newUri);

        // Simulate the transcription process.
        const transcription = "Transcription du fichier audio"; // Placeholder for actual transcription result.

        // Navigate to UpdatePatientScreen with all updated data
        navigation.navigate('UpdatePatientScreen', { 
          name, 
          surname, 
          day, 
          month, 
          year, 
          weight, 
          sex, 
          medicalHistory, 
          transcription // New transcription data passed to the screen
        });

        // Clean up state
        setRecording(null);
        clearInterval(intervalId);
        setRecordingDuration(0);
        console.log("Recording stopped and cleaned up.");
      }
    } catch (err) {
      console.error("Échec de l'arrêt de l'enregistrement", err);
    }
  };

  const pauseRecording = async () => {
    try {
      if (recording && !isPaused) {
        await recording.pauseAsync();
        setIsPaused(true);
        clearInterval(intervalId);
        console.log("Recording paused.");
      } else if (recording && isPaused) {
        await recording.startAsync();
        setIsPaused(false);
        const id = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
        setIntervalId(id);
        console.log("Recording resumed.");
      }
    } catch (err) {
      console.error("Échec de la pause/reprise de l'enregistrement", err);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
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
      <Text style={styles.title}>Medical Consultation</Text>
      <Text style={styles.title}>Old patient</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={surname}
        onChangeText={setSurname}
      />
      <View style={styles.dateContainer}>
        <TextInput
          style={styles.dateInput}
          placeholder="Jour"
          value={day}
          onChangeText={setDay}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="Mois"
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="Année"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Sexe:</Text>
        <RadioButton.Group onValueChange={(value) => setSex(value)} value={sex}>
          <View style={styles.radioOption}>
            <RadioButton value="Male" />
            <Text style={styles.radioText}>Male</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="Female" />
            <Text style={styles.radioText}>Female</Text>
          </View>
        </RadioButton.Group>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Poids (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Historique Médical"
        value={medicalHistory}
        onChangeText={setMedicalHistory}
      />
      <View style={styles.recordContainer}>
        <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
          <Icon name="microphone" size={30} color="white" />
         
        </TouchableOpacity>
        <TouchableOpacity onPress={pauseRecording} style={styles.recordButton}>
          <Icon name={isPaused ? "play" : "pause"} size={30} color="white" />
        
        </TouchableOpacity>
        <TouchableOpacity onPress={stopRecording} style={styles.recordButton}>
          <Icon name="stop" size={30} color="white" />
         
        </TouchableOpacity>
      </View>
      <Text style={styles.timer}>{formatTime(recordingDuration)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1c1c1c',
    
  },
  title: {
    color: '#008080',
    paddingTop: 50,
    margintop:20,
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#008080',
    color:'#008080',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dateContainer: {
   
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    color:'#008080',
    borderColor: '#008080',
    flex: 1,
    borderWidth: 1,
   
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
  radioContainer: {
    marginBottom: 10,
  },
  radioLabel: {
    color:'#008080',
    borderColor: '#008080',
    fontSize: 16,
    marginBottom: 5,
  },
  radioOption: {
    borderColor: '#008080',

    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    color:'#008080',

    marginLeft: 8,
  },
  recordContainer: {

    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  recordButton: {
    color:'#008080',
    backgroundColor: '#008080',
    alignItems: 'center',

    padding: 15,
    borderRadius: 20,
  },
  recordButtonText: {
    marginTop: 5,
    color: 'white',
  },
  timer: {
    color:'#008080',
    fontSize: 20,
    textAlign: 'center',
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
