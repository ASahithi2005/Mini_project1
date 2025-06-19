import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ResultScreen from '../screens/ResultScreen';
import { useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const colorScheme = useColorScheme();
  
  const darkTheme = {
    dark: true,
    colors: {
      primary: '#1E88E5',
      background: '#121212',
      card: '#1e1e1e',
      text: '#ffffff',
      border: '#333333',
      notification: '#1E88E5',
    },
  };

  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e1e1e',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 20,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#121212',
        },
        theme: colorScheme === 'dark' ? darkTheme : null,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'MediTrack AI',
          headerBackTitleVisible: false,
        }} 
      />
      <Stack.Screen 
        name="Upload" 
        component={UploadScreen} 
        options={{ 
          title: 'Upload Prescription',
          headerBackTitleVisible: false,
        }} 
      />
      <Stack.Screen 
        name="Result" 
        component={ResultScreen} 
        options={{ 
          title: 'Analysis Results',
          headerBackTitleVisible: false,
        }} 
      />
    </Stack.Navigator>
  );
}