import React from 'react';
import { View, Button } from 'react-native';

export default function DevTestScreen({ navigation }) {
  const mockData = {
    doctorName: 'Dr. Sharma',
    doctorLicense: 'DL-98234',
    patientName: 'Laxmi',
    patientAge: 52,
    patientGender: 'Female',
    diagnosis: 'Cholecystitis, HTN',
    date: '13/07/2021',
    medicines: [
      {
        name: 'Rantac',
        dosage: '150mg',
        frequency: 'OD',
        duration: '5 days',
      },
      {
        name: 'Diclo',
        dosage: '50mg',
        frequency: 'BD',
        duration: '3 days',
      },
    ],
  };

  const mockOcr = `{
  "text": "http://127.0.0.1:8080/BMHOSPTTAL/Emergency _Registration Fo\n{\nShagwan Mahavir Hospital, Pitampura, Delhi, 110034, Govt. Of NCT of Delhi ACCIDENT & EMERGENCY REGISTRATION CARD\nSex :\nName : LAXMI\nDate & Time 13/7/2021\nFemale\nAge 52 Y/O Mnt\nEmr No 84169\nTime : 11 : 48 : 34 AM\nS/D/W of SH\nMLC/NON MLC :\nMLC NO.\nUID NO\nRef. from\nROOM\nDeptt.\nProvisional Diagnosis\nICD-10 Code :\nEMERGENCY/CASUALTY REGISTRATION CARD\nBhagwan Mahavir Hospital, Pitampura, Delhi, 110034, Govt. Of NCT of Delhi\nACCIDENT & EMERGENCY REGISTRATION CARD\nAge : 52 Y/O\nNo. :\nName\nLAXMI\nSex: Female\nMnt/ 0 Day\n84169\nMLC/NON MLC :\nDate 13/7/2021\nS/D/W of SH\nMLC NO:\nTime : 11 : 48 : 34 AM\nMarital:\nAddress:\nPITAM PURA\nOccupation s:\nReligion :\nMarried\nContact No.:\n9891596832\nRef. from\nROOM NO :\nDeptt. :\nProvisional\nK/c/o HTN.\nICD-10 Code :\nDiagnosis\nc/o- pain abdomeno\no/E\nac-fair\nRx\n110/80mmng\ndiclo 1 amp in slat\nPR- 841pm\nkautac 1a mp in stat\nReview in OPD\n102\nORS in 1 (water\nuse 23/3/2021\nT. T. Rantac 1 tab OD BPF\nDiclo 1 tab BD\ncholecystites c\ncholelithians =\nmuco /paty pyocele\nPrint\nback\nof GB .\nform\n13/07/2021 1\n"
}`;

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Button
        title="View Mock Result"
        onPress={() =>
          navigation.navigate('Result', {
            data: mockData,
            ocr_text: mockOcr,
          })
        }
      />
    </View>
  );
}
