import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>MediTrack AI</Text>
        <Text style={styles.tagline}>Your Smart Prescription Assistant</Text>
      </View>

      {/* Primary Action Button at Top */}
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.buttonText}>Upload Prescription</Text>
      </TouchableOpacity>

      {/* Secondary Options */}
      <View style={styles.secondaryOptions}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Manual Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>View Medications</Text>
        </TouchableOpacity>
      </View>

      {/* About Section Moved Below */}
      <View style={styles.aboutCard}>
        <Text style={styles.sectionTitle}>What This Does</Text>
        <Text style={styles.aboutText}>
          MediTrack AI helps you manage medications by analyzing prescriptions, tracking doses, 
          and providing reminders. Simply upload your prescription and let our AI extract all 
          the important details for you.
        </Text>
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Scan prescriptions</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Medication reminders</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Drug interaction alerts</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#aaaaaa',
  },
  aboutCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#cccccc',
    marginBottom: 20,
  },
  featuresContainer: {
    marginTop: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    color: '#4CAF50',
    fontSize: 18,
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
    color: '#dddddd',
  },
  primaryButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  secondaryButton: {
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  secondaryButtonText: {
    color: '#aaaaaa',
    fontSize: 15,
    fontWeight: '500',
  },
});