import {useState, useRef} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {Ionicons} from '@expo/vector-icons';

interface MultiPhotoCameraProps {
    onFinish: (photos: string[], rectangularUri: string | null) => void;
    onCancel: () => void;
    maxPhotos?: number;
}

export function MultiPhotoCamera({
                                     onFinish,
                                     onCancel,
                                     maxPhotos = 4,
                                 }: MultiPhotoCameraProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [cameraPhotos, setCameraPhotos] = useState<string[]>([]);
    const firstCameraPhotoUri = useRef<string | null>(null);
    const [cameraZoom, setCameraZoom] = useState(0);

    if (!permission?.granted) {
        void requestPermission();
        return (
            <View style={styles.cameraContainer}>
                <Text style={styles.permissionText}>Requesting camera permission...</Text>
                <TouchableOpacity style={styles.cameraCancelBtn} onPress={onCancel}>
                    <Text style={styles.cameraCancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleCapture = async () => {
        if (!cameraRef.current || cameraPhotos.length >= maxPhotos) return;
        const photo = await cameraRef.current.takePictureAsync({quality: 0.9});
        if (!photo) return;
        const needsRectangular = !firstCameraPhotoUri.current
            || !cameraPhotos.includes(firstCameraPhotoUri.current);
        if (needsRectangular) {
            firstCameraPhotoUri.current = photo.uri;
        }
        setCameraPhotos((prev) => [...prev, photo.uri]);
    };

    const removeCameraPhoto = (uri: string) => {
        setCameraPhotos((prev) => prev.filter((u) => u !== uri));
    };

    const handleSave = () => {
        const photos = [...cameraPhotos];
        const rectUri = firstCameraPhotoUri.current
            && photos.includes(firstCameraPhotoUri.current)
            ? firstCameraPhotoUri.current
            : null;
        setCameraPhotos([]);
        firstCameraPhotoUri.current = null;
        setCameraZoom(0);
        onFinish(photos, rectUri);
    };

    const handleCancel = () => {
        setCameraPhotos([]);
        firstCameraPhotoUri.current = null;
        setCameraZoom(0);
        onCancel();
    };

    const isFirstPhotoPresent = firstCameraPhotoUri.current
        && cameraPhotos.includes(firstCameraPhotoUri.current);

    return (
        <View style={styles.cameraContainer}>
            <CameraView
                key={`cam-zoom-${cameraZoom}`}
                ref={cameraRef}
                style={StyleSheet.absoluteFillObject}
                facing="back"
                zoom={cameraZoom}
            />

            {/* Top bar: Cancel | counter | Save */}
            <View style={styles.cameraTopBar}>
                <View style={styles.cameraTopRow}>
                    <TouchableOpacity
                        style={styles.cameraCancelBtn}
                        onPress={handleCancel}
                    >
                        <Text style={styles.cameraCancelText}>Cancel</Text>
                    </TouchableOpacity>

                    <Text style={styles.cameraCountText}>
                        {cameraPhotos.length} / {maxPhotos}
                    </Text>

                    {cameraPhotos.length >= maxPhotos ? (
                        <TouchableOpacity
                            style={styles.cameraSaveBtn}
                            onPress={handleSave}
                        >
                            <Text style={styles.cameraSaveText}>Save ✓</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={{width: 80}}/>
                    )}
                </View>

                {cameraPhotos.length > 0 && (
                    <View style={styles.cameraThumbnailStrip}>
                        {cameraPhotos.map((uri) => (
                            <View key={uri} style={styles.cameraThumbnailWrap}>
                                <Image
                                    source={{uri}}
                                    style={[
                                        styles.cameraThumbnail,
                                        uri === firstCameraPhotoUri.current
                                        && {height: 75, aspectRatio: 3 / 4},
                                    ]}
                                />
                                <TouchableOpacity
                                    style={styles.cameraThumbnailRemove}
                                    onPress={() => removeCameraPhoto(uri)}
                                >
                                    <Ionicons name="close-circle" size={20} color="#e03131"/>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Guide box */}
            <View style={styles.guideOverlay} pointerEvents="none">
                <View style={[
                    styles.guideBox,
                    {aspectRatio: isFirstPhotoPresent ? 1 : 3 / 4},
                ]}>
                    <Text style={styles.guideText}>Place item here</Text>
                </View>
            </View>

            {/* Camera controls */}
            <View style={styles.cameraControls}>
                <View style={{width: 44}}/>

                <TouchableOpacity
                    style={[
                        styles.captureBtn,
                        cameraPhotos.length >= maxPhotos && styles.captureBtnDisabled,
                    ]}
                    onPress={handleCapture}
                    disabled={cameraPhotos.length >= maxPhotos}
                >
                    <View style={styles.captureInner}/>
                </TouchableOpacity>

                {/* Zoom toggle */}
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
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        backgroundColor: '#000',
        position: 'relative',
    },
    permissionText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 100,
        marginBottom: 20,
    },
    cameraControls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 10,
    },
    guideOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    guideBox: {
        width: '65%',
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
    cameraCancelBtn: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    cameraCancelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    captureBtn: {
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
    captureBtnDisabled: {
        opacity: 0.3,
    },
    cameraTopBar: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 20,
        paddingHorizontal: 16,
    },
    cameraTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    cameraCountText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        overflow: 'hidden',
    },
    cameraThumbnailStrip: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10,
    },
    cameraThumbnailWrap: {
        position: 'relative',
    },
    cameraThumbnail: {
        width: 56,
        height: 56,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#fff',
    },
    cameraThumbnailRemove: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#1a1b1e',
        borderRadius: 10,
    },
    cameraSaveBtn: {
        backgroundColor: '#0ca678',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    cameraSaveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
