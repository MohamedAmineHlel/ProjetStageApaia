import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
export default function UpdatePatientScreen({ route ,navigation }) {
    const { recordedUri,name, surname, day, month, year, weight, sex, medicalHistory, transcription } = route.params;
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackDuration, setPlaybackDuration] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [patientName, setPatientName] = useState(name);
    const [patientSurname, setPatientSurname] = useState(surname);
    const [patientDay, setPatientDay] = useState(day);
    const [patientMonth, setPatientMonth] = useState(month);
    const [patientYear, setPatientYear] = useState(year);
    const [patientWeight, setPatientWeight] = useState(weight);
    const [patientSex, setPatientSex] = useState(sex);
    const [patientMedicalHistory, setPatientMedicalHistory] = useState(medicalHistory);
    const [patientTranscription, setPatientTranscription] = useState(transcription || '');
    const uploadData = async () => {
      try {
        const formData = new FormData();
        formData.append('audio', {
          uri: recordedUri,
          type: 'audio/3gp',  // Ensure this matches the file type
          name: 'recording.3gp',
        });
    
        // Add patient details to the form data
        formData.append('name', name);
        formData.append('surname', surname);
        formData.append('day', day);
        formData.append('month', month);
        formData.append('year', year);
        formData.append('weight', weight);
        formData.append('sex', sex);
        formData.append('medicalHistory', medicalHistory);
    
        console.log('Uploading data to server...');
        const response = await fetch('http://192.168.1.13:5000/transcribeUpdate', {
          method: 'POST',
          body: formData,
        });
    
        console.log('Response status:', response.status);
        const result = await response.json();
        if (result.transcription) {
          console.log(result.transcription)
          navigation.navigate('FinalResultScreen', { 
            name, surname, day, month, year, weight, sex, medicalHistory, transcription: result.transcription 
          });
        } else {
          Alert.alert('Échec de la transcription', result.error);
        }
      } catch (err) {
        console.error('Échec de l\'envoi des données', err);
        Alert.alert('Échec de l\'envoi des données');
      }
    };
    useEffect(() => {
      return sound ? () => {
        sound.unloadAsync();
      } : undefined;
    }, [sound]);
  
    const playPauseSound = async () => {
      if (!sound) {
        const { sound: newSound, status } = await Audio.Sound.createAsync({ uri: recordedUri });
        setSound(newSound);
        setTotalDuration(Math.floor(status.durationMillis / 1000)); // Set total duration in seconds
        newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        await newSound.playAsync();
        setIsPlaying(true);
  
        const id = setInterval(() => {
          setPlaybackDuration((prev) => prev + 1);
        }, 1000);
        setIntervalId(id);
      } else if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        clearInterval(intervalId);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
  
        const id = setInterval(() => {
          setPlaybackDuration((prev) => prev + 1);
        }, 1000);
        setIntervalId(id);
      }
    };
  
    const onPlaybackStatusUpdate = (status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPlaybackDuration(0);
        clearInterval(intervalId);
      } else if (status.positionMillis !== undefined) {
        setPlaybackDuration(Math.floor(status.positionMillis / 1000));
      }
    };
  
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    useEffect(() => {
      // Hide the header when this screen is mounted
      navigation.setOptions({ headerShown: false });
    }, [navigation]);
    return (
      <View style={styles.container}>
      
      <Image 
        style={styles.image}
        source={require('./assets/file.png')} // Correct path to the local image
      />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Details</Text>
        <Text style={styles.text}>Name: {name}</Text>
        <Text style={styles.text}>Surname: {surname}</Text>
        <Text style={styles.text}>Date of Birth: {`${day}/${month}/${year}`}</Text>
        <Text style={styles.text}>Weight: {weight}</Text>
        <Text style={styles.text}>Sex: {sex}</Text>
        <Text style={styles.text}>Medical History: {medicalHistory}</Text>
      </View>
      <TouchableOpacity onPress={playPauseSound}>
        <Icon name={isPlaying ? "pause" : "play"} size={40} color="#008080" />
      </TouchableOpacity>
      {sound && (
        <Text style={styles.timer}>
          {formatTime(playbackDuration)} / {formatTime(totalDuration)}
        </Text>
      )}
      <Button title="Send to AI" onPress={uploadData} color='#008080'/>
    </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1c1c1c',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    card: {
      width: '100%',
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#008080',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginBottom: 20,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    text: {
      fontSize: 16,
      marginBottom: 10,
    },
    timer: {
      marginTop: 10,
      fontSize: 20,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
  });