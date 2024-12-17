import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ResultScreen({ route }) {
  const { transcription, name, surname, day, month, year, weight, sex, medicalHistory } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résultat de la transcription</Text>
      <Text style={styles.text}>Nom: {name}</Text>
      <Text style={styles.text}>Prénom: {surname}</Text>
      <Text style={styles.text}>Date de naissance: {`${day}/${month}/${year}`}</Text>
      <Text style={styles.text}>Poids: {weight}</Text>
      <Text style={styles.text}>Sexe: {sex}</Text>
      <Text style={styles.text}>Historique médical: {medicalHistory}</Text>
      <Text style={styles.text}>Transcription:</Text>
      <Text style={styles.transcription}>{transcription}</Text>
      <Text style={styles.finalMessage}>Merci d'utiliser notre application!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  transcription: {
    fontSize: 16,
    marginBottom: 20,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
  },
  finalMessage: {
    fontSize: 18,
    color: 'green',
    marginTop: 20,
  },
});
