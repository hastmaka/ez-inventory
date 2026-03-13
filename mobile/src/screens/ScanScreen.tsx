import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../config/firebase';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'Scan'>;

interface QrPayload {
  sessionId: string;
  userId: string;
  code: string;
  apiUrl: string;
}

export default function ScanScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanActive, setIsScanActive] = useState(false);

  async function handleStartScan() {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Denied', 'Camera access is needed to scan QR codes.');
        return;
      }
    }
    setIsScanActive(true);
  }

  async function handleBarCodeScanned({ data }: { data: string }) {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const payload: QrPayload = JSON.parse(data);
      const { sessionId, userId, code, apiUrl } = payload;

      if (!sessionId || !userId || !code || !apiUrl) {
        throw new Error('Invalid QR code data');
      }

      const url = `${apiUrl}user/verify/2fa?user_code=${code}&user_id=${userId}`;
      const response = await fetch(url);
      const result = await response.json();

      if (!result?.success) {
        throw new Error('Verification failed');
      }

      await signInWithCustomToken(auth, result.auth.token);

      navigation.replace('Camera', { sessionId });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('Error', message);
      setIsProcessing(false);
      setIsScanActive(false);
    }
  }

  if (isProcessing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#228be6" />
        <Text style={styles.message}>Authenticating...</Text>
      </View>
    );
  }

  if (!isScanActive) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>QR Camera Session</Text>
        <TouchableOpacity style={styles.startButton} onPress={handleStartScan}>
          <Text style={styles.startButtonText}>Scan QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backLinkText}>Back to Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
      </View>
      <Text style={styles.hint}>Scan the QR code from your desktop</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  startButton: {
    marginTop: 24,
    backgroundColor: '#228be6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backLink: {
    marginTop: 16,
  },
  backLinkText: {
    color: '#868e96',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 32,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#228be6',
    borderRadius: 12,
  },
  hint: {
    position: 'absolute',
    bottom: 100,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
