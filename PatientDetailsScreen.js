import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';


export default function PatientDetailsScreen({ route, navigation }) {
  const { patientId } = route.params; // Get the patient ID from route params
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.13:5000/patient/${patientId}`);
        setPatient(response.data);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  useEffect(() => {
    // Hide the header when this screen is mounted
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text>Patient not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Details</Text>
      <Text style={styles.label}>Name: <Text style={styles.info}>{patient.name}</Text></Text>
      <Text style={styles.label}>Surname: <Text style={styles.info}>{patient.surname}</Text></Text>
      <Text style={styles.label}>Date of Birth: <Text style={styles.info}>{patient.birthdate}</Text></Text>
      <Text style={styles.label}>Weight: <Text style={styles.info}>{patient.weight} kg</Text></Text>
      <Text style={styles.label}>Sex: <Text style={styles.info}>{patient.sex}</Text></Text>
      <Text style={styles.label}>Medical History: <Text style={styles.info}>{patient.medicalHistory}</Text></Text>
      <Text style={styles.label}>Last Consultation Date: <Text style={styles.info}>{patient.recordDate}</Text></Text>
      <Text style={styles.label}>Last Transcription: {patient.transcription}</Text>

      {/* Button to play audio */}
      {/* <Button title="Listen to Recording" style={styles.button}  disabled /> */}

      {/* Navigation button to RecordScreen */}
      <Button title="new Consultation" color="#008080"  onPress={() => navigation.navigate('RecordScreen', {
        name: patient.name,
        surname: patient.surname,
        day: patient.birthdate.split('-')[2], // Assuming birthdate is in YYYY-MM-DD format
        month: patient.birthdate.split('-')[1], // Extract month
        year: patient.birthdate.split('-')[0], // Extract year
        weight: patient.weight,
        sex: patient.sex,
        medicalHistory: patient.medicalHistory
      })} />
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:50,
    textAlign: 'center',
    color: '#508080',
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
    color: '#508080',
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
    color: '#FF0000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#008080',
    color: '#008080',
    marginTop:20,
    marginBottom:20,
  },
});
