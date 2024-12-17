import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen'; // Ensure the correct path
import HomeScreen from './HomeScreen'; // Ensure the correct path
import SaveScreen from './SaveScreen'; // Ensure the correct path
import FinalResultScreen from './FinalResultScreen'; // Ensure the correct path
import ForgotPasswordScreen from './ForgotPassword';
import RecordScreen from './RecordScreen';
import UpdatePatientScreen from './UpdatePatientScreen';
// Import the SignupScreen and LoginScreen components
import SignupScreen from './SignupScreen'; // Ensure the correct path
import LoginScreen from './LoginScreen'; // Ensure the correct path
import PatientListScreen from './PatientListScreen'; 
import PatientDetailsScreen from './PatientDetailsScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName="Login">
      
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PatientList" component={PatientListScreen} />
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="RecordScreen" 
          component={RecordScreen} 
        />
        <Stack.Screen 
          name="Save" 
          component={SaveScreen} 
        />
        <Stack.Screen 
          name="FinalResultScreen" 
          component={FinalResultScreen} 
        />
        <Stack.Screen 
          name="UpdatePatientScreen" 
          component={UpdatePatientScreen} 
        />
        <Stack.Screen 
          name="PatientDetailsScreen" 
          component={PatientDetailsScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}