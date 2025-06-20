import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export default function ResultScreen({ route }) {
  const { data } = route.params;

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }
  }, []);

  const formatTiming = (frequency) => {
    if (!frequency) return 'Not specified';

    const cleaned = frequency.toUpperCase().trim();

    const timingMap = {
      'OD': 'Once daily (Morning)',
      'BD': 'Twice daily (Morning & Night)',
      'TDS': 'Thrice daily (Morning, Afternoon, Night)',
      'QID': 'Four times daily',
      'HS': 'At bedtime',
      'SOS': 'As needed',
      'STAT': 'Immediately (One-time)',
    };

    if (timingMap[cleaned]) return timingMap[cleaned];

    // Keyword-based parsing
    if (cleaned.includes('MORNING')) return 'Morning';
    if (cleaned.includes('NIGHT')) return 'Night';
    if (cleaned.includes('AFTER FOOD')) return 'After food';
    if (cleaned.includes('BEFORE FOOD') || cleaned.includes('BPF')) return 'Before food';
    if (cleaned.includes('EVENING')) return 'Evening';
    if (cleaned.includes('AFTERNOON')) return 'Afternoon';
    if (cleaned.includes('STAT')) return 'Immediately (Stat dose)';
    if (cleaned.includes('DAILY')) return 'Daily';

    return 'Not specified';
  };

  const getTimeOffsets = (freq) => {
    switch (freq?.toUpperCase()) {
      case 'OD': return [9];
      case 'BD': return [9, 21];
      case 'TDS': return [8, 14, 20];
      case 'QID': return [8, 12, 16, 20];
      case 'HS': return [22];
      default: return [10];
    }
  };

  const scheduleNotification = async (medName, freq) => {
    const hours = getTimeOffsets(freq);

    for (let hour of hours) {
      const trigger = new Date();
      trigger.setHours(hour, 0, 0);

      if (trigger.getTime() < Date.now()) {
        trigger.setDate(trigger.getDate() + 1);
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `💊 ${medName}`,
          body: `Time to take ${medName} (${formatTiming(freq)})`,
          sound: true,
        },
        trigger,
      });
    }
  };

  const setupNotifications = async () => {
    if (!Device.isDevice) {
      Alert.alert('Device Required', 'Must use physical device for notifications.');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Notification permissions not granted.');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Test Notification',
        body: 'You will receive medicine reminders soon!',
        sound: true,
      },
      trigger: { seconds: 5 },
    });

    if (data?.medicines?.length > 0) {
      for (let med of data.medicines) {
        await scheduleNotification(med.name, med.frequency);
      }
      Alert.alert('✅ Reminders Set', 'Medicine notifications have been scheduled!');
    }
  };

  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 💊 Medication Schedule First */}
      <Text style={styles.sectionHeader}>💊 Medication Schedule</Text>
      {data?.medicines?.length > 0 ? (
        <View style={styles.medTable}>
          <View style={[styles.medRow, styles.tableHeader]}>
            <Text style={styles.medHeader}>Medicine</Text>
            <Text style={styles.medHeader}>Dosage</Text>
            <Text style={styles.medHeader}>Timing</Text>
          </View>
          {data.medicines.map((med, idx) => (
            <View key={idx} style={[styles.medRow, idx % 2 === 0 ? styles.evenRow : styles.oddRow]}>
              <Text style={styles.medCell}>{med.name}</Text>
              <Text style={styles.medCell}>{med.dosage || 'unspecified'}</Text>
              <Text style={styles.medCell}>
                {formatTiming(med.frequency)}
                {'\n'}
                <Text style={{ color: '#888', fontSize: 11 }}>{med.frequency}</Text>
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noMedsText}>No medications prescribed</Text>
      )}

      {/* 📋 Patient Information Below */}
      <Text style={styles.sectionHeader}>📋 Patient Information</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Doctor:</Text><Text style={styles.infoValue}>{data?.doctorName || 'unspecified'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>License:</Text><Text style={styles.infoValue}>{data?.doctorLicense || 'unspecified'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Patient:</Text><Text style={styles.infoValue}>{data?.patientName || 'unspecified'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Age/Gender:</Text><Text style={styles.infoValue}>{`${data?.patientAge || 'NA'}/${data?.patientGender || 'NA'}`}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Diagnosis:</Text><Text style={styles.infoValue}>{data?.diagnosis || 'unspecified'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Date:</Text><Text style={styles.infoValue}>{data?.date || 'unspecified'}</Text></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E88E5',
    marginTop: 20,
    marginBottom: 12,
  },
  infoGrid: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  infoLabel: {
    color: '#aaaaaa',
    fontWeight: '600',
    flex: 1,
  },
  infoValue: {
    color: '#ffffff',
    flex: 2,
    textAlign: 'right',
  },
  medTable: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: '#1E88E5',
  },
  medRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  evenRow: {
    backgroundColor: '#1e1e1e',
  },
  oddRow: {
    backgroundColor: '#252525',
  },
  medHeader: {
    color: '#ffffff',
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  medCell: {
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  noMedsText: {
    color: '#aaaaaa',
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
});
