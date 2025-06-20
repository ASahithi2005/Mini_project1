// utils/notificationUtils.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }
  return false;
}

export async function scheduleMedicationNotification(name, frequency) {
  const getTimeOffsets = (freq) => {
    switch (freq?.toUpperCase()) {
      case 'OD': return [9];                         // Once - 9 AM
      case 'BD': return [9, 21];                     // Morning & Night
      case 'TDS': return [8, 14, 20];                // Thrice
      case 'QID': return [8, 12, 16, 20];            // Four times
      case 'HS': return [22];                        // At bedtime
      default: return [10];                          // Default fallback
    }
  };

  const hours = getTimeOffsets(frequency);

  for (let i = 0; i < hours.length; i++) {
    const trigger = new Date(Date.now());
    trigger.setHours(hours[i], 0, 0); // hr:min:sec

    // If the time already passed for today, schedule for tomorrow
    if (trigger.getTime() < Date.now()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `💊 Time for ${name}`,
        body: `Please take your medication (${frequency})`,
        sound: true,
      },
      trigger,
    });
  }
}
