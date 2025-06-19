import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function ResultScreen({ route }) {
  const { data, ocr_text } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🧾 OCR Extracted Text</Text>
      <Text style={styles.block}>{ocr_text}</Text>

      <Text style={styles.header}>📋 Parsed Prescription Info</Text>
      <Text style={styles.label}>Doctor: {data?.doctorName}</Text>
      <Text style={styles.label}>License: {data?.doctorLicense}</Text>
      <Text style={styles.label}>Patient: {data?.patientName}</Text>
      <Text style={styles.label}>Age: {data?.patientAge}</Text>
      <Text style={styles.label}>Gender: {data?.patientGender}</Text>
      <Text style={styles.label}>Diagnosis: {data?.diagnosis}</Text>
      <Text style={styles.label}>Date: {data?.date}</Text>

      <Text style={styles.header}>💊 Medicines</Text>
      {data?.medicines?.length > 0 ? (
        data.medicines.map((med, idx) => (
          <View key={idx} style={styles.card}>
            <Text>Name: {med.name}</Text>
            <Text>Dosage: {med.dosage}</Text>
            <Text>Frequency: {med.frequency}</Text>
            <Text>Duration: {med.duration}</Text>
          </View>
        ))
      ) : (
        <Text>No medicines listed</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  block: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    fontFamily: 'monospace',
    marginBottom: 15,
  },
  label: { marginBottom: 5 },
  card: {
    backgroundColor: '#e7f3ff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
});
