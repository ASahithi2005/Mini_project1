import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { parsePrescriptionText } from '../api/prescriptionApi';

export default function ResultScreen({ route }) {
  const { text } = route.params;
  const [parsedData, setParsedData] = useState(null);

  useEffect(() => {
    async function fetchParsedData() {
      try {
        const response = await parsePrescriptionText(text);
        setParsedData(response.data);
      } catch (err) {
        console.error('NLP error:', err);
      }
    }
    fetchParsedData();
  }, [text]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Extracted Prescription Info:</Text>
      {parsedData?.entities?.length ? (
        parsedData.entities.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text>Drug: {item.drug}</Text>
            <Text>Dosage: {item.dose}</Text>
            <Text>Frequency: {item.frequency}</Text>
            <Text>Duration: {item.duration}</Text>
          </View>
        ))
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { backgroundColor: '#f0f0f0', padding: 10, marginBottom: 10, borderRadius: 8 },
});
