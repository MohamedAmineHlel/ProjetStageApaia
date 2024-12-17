import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function PatientListScreen({ navigation }) {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]); // New state for filtered patients
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input


  useEffect(() => {
    fetchPatients();
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Function to fetch the patients from the API
  const fetchPatients = () => {
    setLoading(true);
    axios.get('http://192.168.1.13:5000/patients')
      .then(response => {
        setPatients(response.data);
        setFilteredPatients(response.data); // Set both patients and filtered patients initially
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the patients!", error);
        setLoading(false);
      });
  };

  // Handle search logic
  const handleSearch = (text) => {
    setSearchTerm(text);

    if (text === '') {
      setFilteredPatients(patients); // If search is empty, show all patients
    } else {
      const filteredData = patients.filter(patient => 
        patient.name.toLowerCase().includes(text.toLowerCase()) || 
        patient.surname.toLowerCase().includes(text.toLowerCase()) ||
        patient.birthdate.includes(text) ||   // Search by birthdate
        patient.recordDate.includes(text)     // Search by recordDate
      );
      setFilteredPatients(filteredData);
    }
  };

  // Confirmation alert before deleting a patient
  function confirmDelete(patientId) {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this patient?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deletePatient(patientId),  // If confirmed, proceed to delete
          style: "destructive",
        }
      ]
    );
  }

  function deletePatient(patientId) {
    fetch(`http://192.168.1.17:5000/patients/${patientId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log(data.message);  // Patient deleted successfully
            fetchPatients();  // Refresh the list
        } else {
            console.error(data.error);  // Handle errors
        }
    })
    .catch(error => console.error('Error:', error));
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }
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

      <Text style={styles.title}>Liste des Patients</Text>

      {/* Search input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by laste name, first name or birthdate..."
        value={searchTerm}
        onChangeText={handleSearch} // Update the list based on search
      />

      <FlatList
        data={filteredPatients}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.patientCard}>
            <Text style={styles.patientName}>{item.name} {item.surname}</Text>
            <Text>birthday: {item.birthdate}</Text>
         
            <Text>Sexe: {item.sex}</Text>
            <Text>Last Consultation Date: {item.recordDate}</Text>

            {/* Button to view details */}
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => {
                // Navigate to PatientDetailsScreen with patient data
                navigation.navigate('PatientDetailsScreen', {
                  patientId: item.id,
                });
              }}
            >
              <Text style={styles.detailsButtonText}>Voir détails</Text>
            </TouchableOpacity>

            {/* Button to delete the patient */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDelete(item.id)}  // Show confirmation before deleting
            >
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    fontSize: 24,
    marginBottom: 20,
    margintop: 100,
    paddingTop:50,
    textAlign: 'center',
    color: '#008080',

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#008080',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#008f80',
  },
  patientCard: {
    backgroundColor: '#008f80',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  detailsButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3D00',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
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
