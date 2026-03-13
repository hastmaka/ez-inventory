import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { uploadPhoto } from '../utils/uploadPhoto';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'Camera'>;

interface PhotoItem {
  id: string;
  localUri: string;
  isUploading: boolean;
  isUploaded: boolean;
}

export default function CameraScreen({ route, navigation }: Props) {
  const { sessionId } = route.params;
  const { width: screenWidth } = useWindowDimensions();
  const guideSize = Math.round(screenWidth * 0.8);
  const cameraRef = useRef<CameraView>(null);
  const [permission] = useCameraPermissions();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isTaking, setIsTaking] = useState(false);
  const [cameraZoom, setCameraZoom] = useState(0);

  const uploadedCount = photos.filter((p) => p.isUploaded).length;

  async function handleCapture() {
    if (!cameraRef.current || isTaking) return;
    setIsTaking(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (!photo) {
        setIsTaking(false);
        return;
      }

      const id = Date.now().toString();
      const newPhoto: PhotoItem = {
        id,
        localUri: photo.uri,
        isUploading: true,
        isUploaded: false,
      };

      setPhotos((prev) => [newPhoto, ...prev]);
      setIsTaking(false);

      try {
        await uploadPhoto(photo.uri, sessionId);
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isUploading: false, isUploaded: true } : p,
          ),
        );
      } catch (error) {
        console.error('Upload failed:', error);
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isUploading: false } : p,
          ),
        );
        Alert.alert('Upload Error', 'Failed to upload photo.');
      }
    } catch (error) {
      console.error('Capture failed:', error);
      setIsTaking(false);
    }
  }

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission not granted.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        key={`cam-zoom-${cameraZoom}`}
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        zoom={cameraZoom}
      />

      {/* Dark overlay with transparent guide box */}
      <View style={styles.guideOverlay} pointerEvents="none">
        <View style={styles.guideDarkBand} />
        <View style={styles.guideMiddleRow}>
          <View style={styles.guideDarkSide} />
          <View style={[styles.guideBox, { width: guideSize, height: guideSize }]}>
            <Text style={styles.guideText}>Coloca la prenda aquí</Text>
          </View>
          <View style={styles.guideDarkSide} />
        </View>
        <View style={styles.guideDarkBand} />
      </View>

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {uploadedCount} photo{uploadedCount !== 1 ? 's' : ''} taken
          </Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        {photos.length > 0 && (
          <FlatList
            data={photos}
            horizontal
            keyExtractor={(item) => item.id}
            style={styles.thumbnailStrip}
            contentContainerStyle={styles.thumbnailContent}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.thumbnailWrapper}>
                <Image source={{ uri: item.localUri }} style={styles.thumbnail} />
                {item.isUploading && (
                  <View style={styles.thumbnailOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}
                {item.isUploaded && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>OK</Text>
                  </View>
                )}
              </View>
            )}
          />
        )}

        <View style={styles.captureRow}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            disabled={isTaking}
            activeOpacity={0.7}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() => setCameraZoom((prev) => (prev === 0 ? 0.5 : 0))}
          >
            <Text style={styles.zoomBtnText}>
              {cameraZoom === 0 ? 'x1' : 'x2'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  badge: {
    backgroundColor: '#228be6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 40,
    zIndex: 10,
  },
  thumbnailStrip: {
    maxHeight: 72,
    marginBottom: 16,
  },
  thumbnailContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  thumbnailWrapper: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#40c057',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  guideOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  guideDarkBand: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  guideMiddleRow: {
    flexDirection: 'row',
  },
  guideDarkSide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  guideBox: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
  },
  guideText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  zoomBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
