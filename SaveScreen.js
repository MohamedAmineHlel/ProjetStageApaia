import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SaveScreen({ route, navigation }) {
  const { recordedUri, name, surname, day, month, year, weight, sex, medicalHistory } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // const uploadData = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('audio', {
  //       uri: recordedUri,
  //       type: 'audio/3gp',  // Ensure this matches the file type
  //       name: 'recording.3gp',
  //     });
  
  //     console.log('Uploading data to server...');
  //     const response = await fetch('http://192.168.1.12:5000/transcribe', {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     console.log('Response status:', response.status);
  //     const result = await response.json();
  //     if (result.transcription) {
  //       navigation.navigate('FinalResultScreen', { 
  //         name, surname, day, month, year, weight, sex, medicalHistory, transcription: result.transcription 
  //       });
  //     } else {
  //       Alert.alert('Échec de la transcription', result.error);
  //     }
  //   } catch (err) {
  //     console.error('Échec de l\'envoi des données', err);
  //     Alert.alert('Échec de l\'envoi des données');
  //   }
  // };
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
      const response = await fetch('http://192.168.1.13:5000/transcribe', {
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
  useEffect(() => {
    // Hide the header when this screen is mounted
    navigation.setOptions({ headerShown: false });
  }, [navigation]);


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
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Details</Text>
        <Text style={styles.text}>Name: {name}</Text>
        <Text style={styles.text}>Surname: {surname}</Text>
        <Text style={styles.text}>BirthDate: {`${day}/${month}/${year}`}</Text>
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
      <View style={styles.button} >
      <Button title="Send to AI"  onPress={uploadData} color="#008080"/>
      </View>
      
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
    backgroundColor: '#008f80',
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
    color: '#008080',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
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
  button: {
    backgroundColor: '#008080',
    color: '#008080',
    marginTop:20,
  },
});
