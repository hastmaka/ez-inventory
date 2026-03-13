import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,

} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { uploadToFirebase } from '../utils/uploadPhoto';
import { fetchApi } from '../api/fetchApi';
import { SelectDropdown } from '../components/SelectDropdown';
import { MultiPhotoCamera } from '../components/MultiPhotoCamera';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'AddProduct'>;

const IS_WEB = Platform.OS === 'web';

interface SelectOption {
  label: string;
  value: number | string;
}

interface AiRawImage {
  localUri: string;
  firebaseUrl: string | null;
  isRectangular: boolean;
}

const GRAMS_PER_OZ = 28.3495;
const ozToGrams = (oz: number): number =>
  Math.round(oz * GRAMS_PER_OZ * 100) / 100;

const SELECT_ITERATOR = { label: 'asset_option_name', value: 'asset_option_id' };

export default function AddProductScreen({ navigation, route }: Props) {
  const editProductId = route.params?.productId;
  const isEditMode = !!editProductId;

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEditMode ? 'Edit Product' : 'Add Product' });
  }, [navigation, isEditMode]);


  const webFileInputRef = useRef<HTMLInputElement | null>(null);
  const webTargetRef = useRef<'description' | 'product' | 'ai-raw'>('description');

  // Select dropdown state
  const [material, setMaterial] = useState<SelectOption | null>(null);
  const [productType, setProductType] = useState<SelectOption | null>(null);
  const [gemType, setGemType] = useState<SelectOption | null>(null);
  const [labour, setLabour] = useState('');

  // Image state
  const [descriptionImageUris, setDescriptionImageUris] = useState<string[]>([]);
  const [descriptionImageUrls, setDescriptionImageUrls] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);

  // AI / form state
  const [aiLoading, setAiLoading] = useState(true);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [selectedDescIndex, setSelectedDescIndex] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // UI state
  const [pickerTarget, setPickerTarget] = useState<
    'description' | 'product' | 'ai-raw' | null
  >(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'description' | 'product'>('description');
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [selectErrors, setSelectErrors] = useState<Record<string, boolean>>({});

  // AI Photo Generator state
  const [aiRawImages, setAiRawImages] = useState<AiRawImage[]>([]);
  const [aiGeneratedImages, setAiGeneratedImages] = useState<string[]>([]);
  const [aiSelectedIndexes, setAiSelectedIndexes] = useState<Set<number>>(new Set());
  const [isGeneratingAiPhotos, setIsGeneratingAiPhotos] = useState(false);

  useEffect(() => {
    const parent = navigation.getParent();
    if (isCameraOpen) {
      navigation.setOptions({ headerShown: false });
      parent?.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ headerShown: true });
      parent?.setOptions({
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#141517',
          borderTopColor: '#25262b',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
      });
    }
  }, [isCameraOpen, navigation]);

  // Edit mode: fetch product data
  useEffect(() => {
    if (!editProductId) return;
    setIsEditLoading(true);
    fetchApi(`v1/product/${editProductId}`, 'GET')
      .then((response) => {
        if (response?.success && response.data) {
          const p = response.data;
          if (p.product_title) setTitle(p.product_title);
          if (p.product_color) setColor(p.product_color);
          if (p.product_weight_g != null) {
            setWeight(
              String(Math.round((p.product_weight_g / GRAMS_PER_OZ) * 100) / 100),
            );
          }
          if (p.product_height) setHeight(String(p.product_height));
          if (p.product_width) setWidth(String(p.product_width));
          if (p.product_length) setLength(String(p.product_length));
          if (p.product_tag) {
            const tagArr = Array.isArray(p.product_tag)
              ? p.product_tag
              : [String(p.product_tag)];
            setTags(tagArr);
          }
          if (p.product_description) {
            setDescriptions([p.product_description]);
            setSelectedDescIndex(0);
          }
          if (p.product_material) {
            setMaterial({ label: String(p.product_material), value: p.product_material });
          }
          if (p.product_type) {
            setProductType({ label: String(p.product_type), value: p.product_type });
          }
          if (p.product_gem_type) {
            setGemType({ label: String(p.product_gem_type), value: p.product_gem_type });
          }
          if (p.product_crafting_price) {
            setLabour(String(p.product_crafting_price));
          }
          // Load images
          if (Array.isArray(p.product_image_url)) {
            const primary = p.product_image_url.find(
              (img: { document_primary: boolean }) => img.document_primary,
            );
            if (primary?.document_url) {
              setDescriptionImageUris([primary.document_url]);
              setDescriptionImageUrls([primary.document_url]);
            }
            const others = p.product_image_url
              .filter(
                (img: { document_primary: boolean }) => !img.document_primary,
              )
              .map((img: { document_url: string }) => img.document_url);
            if (others.length > 0) setProductImages(others);
          }
          // Skip AI phase in edit mode
          setAiLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to load product:', error);
        Toast.show({ type: 'error', text1: 'Failed to load product' });
      })
      .finally(() => setIsEditLoading(false));
  }, [editProductId]);

  const handleWebFilePick = useCallback(
    (event: Event) => {
      const input = event.target as HTMLInputElement;
      const files = input.files;
      if (!files || files.length === 0) return;
      const target = webTargetRef.current;

      const fileList = Array.from(files);

      for (const file of fileList) {
        const uri = URL.createObjectURL(file);

        if (target === 'description') {
          setDescriptionImageUris([uri]);
          setDescriptionImageUrls([]);
          break;
        } else if (target === 'ai-raw') {
          const localUri = uri;
          setAiRawImages((prev) => [
            ...prev,
            { localUri, firebaseUrl: null, isRectangular: false },
          ]);
          uploadToFirebase(localUri, 'ai-raw')
            .then((result) => setAiRawImages((prev) =>
              prev.map((img) => img.localUri === localUri
                ? { ...img, firebaseUrl: result.url }
                : img),
            ))
            .catch((err) => {
              console.error('Upload failed:', err);
              setAiRawImages((prev) => prev.filter((img) => img.localUri !== localUri));
              Toast.show({ type: 'error', text1: 'Failed to upload photo' });
            });
        } else {
          uploadToFirebase(uri, 'product')
            .then((result) => setProductImages((prev) => [...prev, result.url]))
            .catch((err) => {
              console.error('Upload failed:', err);
              Toast.show({ type: 'error', text1: 'Failed to upload photo' });
            });
        }
      }
      // Reset so the same file can be picked again
      input.value = '';
    },
    [],
  );

  function openWebFilePicker(target: 'description' | 'product' | 'ai-raw') {
    webTargetRef.current = target;
    if (!webFileInputRef.current) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.style.display = 'none';
      input.addEventListener('change', handleWebFilePick);
      document.body.appendChild(input);
      webFileInputRef.current = input;
    }
    webFileInputRef.current.multiple = target !== 'description';
    webFileInputRef.current.click();
  }

  function openImagePicker(target: 'description' | 'product' | 'ai-raw') {
    if (target === 'ai-raw') {
      if (IS_WEB) {
        setPickerTarget(target);
      } else {
        const maxToSelect = 4 - aiRawImages.length;
        Alert.alert('Add Photos', 'Choose a source', [
          {
            text: 'Camera',
            onPress: () => {
              webTargetRef.current = 'ai-raw';
              openCamera('product');
            },
          },
          {
            text: `Gallery (up to ${maxToSelect})`,
            onPress: () => openGallery(target, maxToSelect),
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }
      return;
    }

    // description / product → native picker directly
    if (IS_WEB) {
      openWebFilePicker(target);
    } else {
      openGallery(target, target === 'description' ? 1 : 10);
    }
  }

  function openCamera(target: 'description' | 'product') {
    setCameraTarget(target);
    setIsCameraOpen(true);
  }

  async function openGallery(
    target: 'description' | 'ai-raw' | 'product',
    maxSelection: number,
  ) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Gallery access is required' });
      return;
    }

    const isSingle = target === 'description';
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: !isSingle,
      selectionLimit: maxSelection,
      quality: 0.9,
    });

    if (result.canceled || result.assets.length === 0) return;

    if (target === 'ai-raw') {
      const newEntries: AiRawImage[] = result.assets.map((asset) => ({
        localUri: asset.uri,
        firebaseUrl: null,
        isRectangular: false,
      }));
      setAiRawImages((prev) => [...prev, ...newEntries]);

      for (const asset of result.assets) {
        try {
          const uploaded = await uploadToFirebase(asset.uri, 'ai-raw');
          setAiRawImages((prev) =>
            prev.map((img) => img.localUri === asset.uri
              ? { ...img, firebaseUrl: uploaded.url }
              : img),
          );
        } catch (error) {
          console.error('Upload failed:', error);
          setAiRawImages((prev) => prev.filter((img) => img.localUri !== asset.uri));
          Toast.show({ type: 'error', text1: 'Failed to upload photo' });
        }
      }
      return;
    }

    for (const asset of result.assets) {
      try {
        if (target === 'description') {
          setDescriptionImageUris([asset.uri]);
          setDescriptionImageUrls([]);
          break;
        }
        const uploaded = await uploadToFirebase(asset.uri, target);
        setProductImages((prev) => [...prev, uploaded.url]);
      } catch (error) {
        console.error('Upload failed:', error);
        Toast.show({ type: 'error', text1: 'Failed to upload photo' });
      }
    }
  }

  async function finishCameraSession(photos: string[], rectangularUri: string | null = null) {
    setIsCameraOpen(false);

    if (cameraTarget === 'description') {
      setDescriptionImageUris(photos.length > 0 ? [photos[0]] : []);
      setDescriptionImageUrls([]);
    } else if (webTargetRef.current === 'ai-raw') {
      const newEntries: AiRawImage[] = photos.map((uri) => ({
        localUri: uri,
        firebaseUrl: null,
        isRectangular: uri === rectangularUri,
      }));
      setAiRawImages((prev) => [...prev, ...newEntries]);

      for (const uri of photos) {
        try {
          const result = await uploadToFirebase(uri, 'ai-raw');
          setAiRawImages((prev) =>
            prev.map((img) => img.localUri === uri
              ? { ...img, firebaseUrl: result.url }
              : img),
          );
        } catch (error) {
          console.error('Upload failed:', error);
          setAiRawImages((prev) => prev.filter((img) => img.localUri !== uri));
          Toast.show({ type: 'error', text1: 'Failed to upload photo' });
        }
      }
    } else {
      for (const uri of photos) {
        try {
          const result = await uploadToFirebase(uri, 'product');
          setProductImages((prev) => [...prev, result.url]);
        } catch (error) {
          console.error('Upload failed:', error);
          Toast.show({ type: 'error', text1: 'Failed to upload photo' });
        }
      }
    }
  }

  async function handleDescriptionPress() {
    if (descriptionImageUris.length === 0) {
      Toast.show({ type: 'error', text1: 'Take a description photo first' });
      return;
    }

    // Validate required selects
    const errors: Record<string, boolean> = {};
    if (!material) errors.material = true;
    if (!productType) errors.productType = true;
    if (Object.keys(errors).length > 0) {
      setSelectErrors(errors);
      Toast.show({ type: 'error', text1: 'Material and Type are required' });
      return;
    }
    setSelectErrors({});

    setIsFetching(true);
    try {
      // Upload all description images to Firebase
      const uploadedUrls: string[] = [];
      for (const uri of descriptionImageUris) {
        const firebaseResult = await uploadToFirebase(uri, 'product');
        uploadedUrls.push(firebaseResult.url);
      }
      setDescriptionImageUrls(uploadedUrls);
      const imageUrl = uploadedUrls[0];

      // Build query params matching web's aiGetData
      const queryParams: Record<string, unknown> = {
        image_url: imageUrl,
      };
      if (material) queryParams.product_material = material.value;
      if (productType) queryParams.product_type = productType.value;
      if (gemType) queryParams.product_gem_type = gemType.value;
      if (labour) queryParams.product_crafting_price = Number(labour);

      const response = await fetchApi(
        'v1/ai/product_description',
        'GET',
        null,
        queryParams,
      );

      if (response?.success && response.data) {
        const d = response.data;
        if (d.product_description) setDescriptions(d.product_description);
        if (d.product_title) setTitle(d.product_title);
        if (d.product_color) setColor(d.product_color);
        if (d.product_weight_g != null) {
          setWeight(
            String(Math.round((d.product_weight_g / GRAMS_PER_OZ) * 100) / 100),
          );
        }
        if (d.product_height) setHeight(String(d.product_height));
        if (d.product_width) setWidth(String(d.product_width));
        if (d.product_length) setLength(String(d.product_length));
        if (d.product_tag) {
          const tagArr = Array.isArray(d.product_tag)
            ? d.product_tag
            : [String(d.product_tag)];
          setTags(tagArr);
        }
        setAiLoading(false);
      }
    } catch (error) {
      console.error('AI description failed:', error);
      Toast.show({ type: 'error', text1: 'Failed to generate description' });
    }
    setIsFetching(false);
  }

  async function handleSave() {
    if (!weight.trim() || !height.trim() || !width.trim() || !length.trim()) {
      Toast.show({ type: 'error', text1: 'Weight, height, width, and length are required' });
      return;
    }
    if (!title.trim()) {
      Toast.show({ type: 'error', text1: 'Title is required' });
      return;
    }
    if (selectedDescIndex === null && descriptions.length > 0) {
      Toast.show({ type: 'error', text1: 'Please select a description' });
      return;
    }

    setIsSaving(true);
    try {
      const imageUrlArray = [
        ...descriptionImageUrls.map((url, i) => ({
          document_primary: i === 0,
          document_type: 'image',
          document_url: url,
        })),
        ...productImages.map((url) => ({
          document_primary: false,
          document_type: 'image',
          document_url: url,
        })),
      ];

      const body: Record<string, unknown> = {
        product_title: title,
        product_color: color || undefined,
        product_weight_g: weight ? ozToGrams(Number(weight)) : undefined,
        product_height: height ? Number(height) : undefined,
        product_width: width ? Number(width) : undefined,
        product_length: length ? Number(length) : undefined,
        product_image_url: imageUrlArray,
      };

      // Extract select values (value only, like web's extractSelectValues)
      if (material) body.product_material = material.value;
      if (productType) body.product_type = productType.value;
      if (gemType) body.product_gem_type = gemType.value;
      if (labour) body.product_crafting_price = Number(labour);

      // Tags
      if (tags.length > 0) {
        body.product_tag = tags;
      }

      // Selected description
      if (selectedDescIndex !== null) {
        body.product_description = descriptions[selectedDescIndex];
      }

      let response;
      if (isEditMode) {
        body.product_id = editProductId;
        response = await fetchApi('v1/product', 'PUT', body);
      } else {
        response = await fetchApi('v1/product', 'POST', body);
      }

      if (response?.success) {
        Toast.show({
          type: 'success',
          text1: isEditMode ? 'Product updated' : 'Product created',
        });
        navigation.goBack();
      } else {
        const msg = response?.message || response?.error || 'Failed to save product';
        Toast.show({ type: 'error', text1: 'Save failed', text2: String(msg) });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Save failed:', error);
      Toast.show({ type: 'error', text1: 'Failed to save product', text2: msg });
    }
    setIsSaving(false);
  }

  async function handleGenerateAiPhotos() {
    if (aiRawImages.length === 0) {
      Toast.show({ type: 'error', text1: 'Upload at least one raw photo' });
      return;
    }
    setIsGeneratingAiPhotos(true);
    try {
      const imageUrls = aiRawImages
        .map((img) => img.firebaseUrl)
        .filter((url): url is string => url !== null);
      // Rectangular photo must be first in the array
      const rectIndex = aiRawImages.findIndex(
        (img) => img.isRectangular && img.firebaseUrl,
      );
      if (rectIndex > 0) {
        const rectUrl = imageUrls[rectIndex];
        imageUrls.splice(rectIndex, 1);
        imageUrls.unshift(rectUrl);
      }
      const response = await fetchApi('v1/ai/shots/generate', 'POST', {
        image_urls: imageUrls,
      });
      if (response?.success && Array.isArray(response.data)) {
        setAiGeneratedImages(response.data);
        setAiSelectedIndexes(new Set());
      } else {
        Toast.show({ type: 'error', text1: 'Failed to generate AI photos' });
      }
    } catch (error) {
      console.error('AI photo generation failed:', error);
      Toast.show({ type: 'error', text1: 'AI photo generation failed' });
    }
    setIsGeneratingAiPhotos(false);
  }

  function toggleAiPhotoSelection(index: number) {
    setAiSelectedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  async function handleSaveAiPhotos() {
    const selected = aiGeneratedImages.filter((_, i) => aiSelectedIndexes.has(i));
    if (selected.length === 0) {
      Toast.show({ type: 'error', text1: 'Select at least one photo' });
      return;
    }

    if (isEditMode && editProductId) {
      // In edit mode, PUT the new images to the server
      try {
        const existingImages = [
          ...descriptionImageUrls.map((url, i) => ({
            document_primary: i === 0,
            document_type: 'image',
            document_url: url,
          })),
          ...productImages.map((url) => ({
            document_primary: false,
            document_type: 'image',
            document_url: url,
          })),
          ...selected.map((url) => ({
            document_primary: false,
            document_type: 'image',
            document_url: url,
          })),
        ];
        await fetchApi('v1/product', 'PUT', {
          product_id: editProductId,
          product_image_url: existingImages,
        });
        Toast.show({ type: 'success', text1: 'AI photos saved' });
      } catch (error) {
        console.error('Failed to save AI photos:', error);
        Toast.show({ type: 'error', text1: 'Failed to save AI photos' });
        return;
      }
    }

    setProductImages((prev) => [...prev, ...selected]);
    setAiGeneratedImages([]);
    setAiSelectedIndexes(new Set());
    setAiRawImages([]);
    Toast.show({ type: 'success', text1: `${selected.length} photo(s) added` });
  }

  function handleCancel() {
    if (isEditMode) {
      navigation.goBack();
      return;
    }
    if (!aiLoading) {
      // Reset to phase 1
      setAiLoading(true);
      setDescriptions([]);
      setSelectedDescIndex(null);
      setTitle('');
      setColor('');
      setWeight('');
      setHeight('');
      setWidth('');
      setLength('');
      setTags([]);
      setTagInput('');
      setDescriptionImageUris([]);
      setDescriptionImageUrls([]);
      setProductImages([]);
    } else {
      navigation.goBack();
    }
  }

  if (isCameraOpen) {
    return (
      <MultiPhotoCamera
        onFinish={(photos) => finishCameraSession(photos)}
        onCancel={() => setIsCameraOpen(false)}
      />
    );
  }

  const hasDescriptionImage = descriptionImageUris.length > 0;

  if (isEditLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#228be6" />
      </View>
    );
  }

  const isAiUploading = aiRawImages.some((img) => img.firebaseUrl === null);

  const renderAiPhotoSection = () => (
    <>
      <Text style={styles.sectionTitle}>AI Photo Generator</Text>
      <View style={styles.imageRow}>
        {aiRawImages.map((img, i) => (
          <View key={i} style={styles.aiRawThumbWrap}>
            <Image
              source={{ uri: img.localUri }}
              style={[styles.thumbImage, !img.firebaseUrl && { opacity: 0.4 }]}
            />
            {!img.firebaseUrl && (
              <ActivityIndicator
                style={styles.aiRawUploadIndicator}
                color="#fff"
                size="small"
              />
            )}
            {aiGeneratedImages.length === 0 && (
              <TouchableOpacity
                style={styles.aiRawRemoveBtn}
                onPress={() => setAiRawImages((prev) => prev.filter((_, idx) => idx !== i))}
              >
                <Ionicons name="close-circle" size={20} color="#e03131" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        {aiRawImages.length < 4 && aiGeneratedImages.length === 0 && (
          <TouchableOpacity
            style={styles.addImageBtn}
            onPress={() => openImagePicker('ai-raw')}
          >
            <Ionicons name="camera-outline" size={22} color="#868e96" />
          </TouchableOpacity>
        )}
      </View>
      {aiGeneratedImages.length === 0 && (
        <TouchableOpacity
          style={[
            styles.aiGenerateBtn,
            (isGeneratingAiPhotos || aiRawImages.length === 0 || isAiUploading)
              && { opacity: 0.5 },
          ]}
          onPress={handleGenerateAiPhotos}
          disabled={isGeneratingAiPhotos || aiRawImages.length === 0 || isAiUploading}
        >
          {isGeneratingAiPhotos ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Generate AI Photos</Text>
          )}
        </TouchableOpacity>
      )}

      {isGeneratingAiPhotos && (
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={[styles.hint, { marginTop: 8 }]}>Generating photos…</Text>
        </View>
      )}

      {aiGeneratedImages.length > 0 && (
        <>
          <Text style={[styles.hint, { marginTop: 10 }]}>
            Select photos to add
          </Text>
          <View style={styles.imageRow}>
            {aiGeneratedImages.map((url, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => toggleAiPhotoSelection(i)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: url }} style={styles.thumbImage} />
                <View
                  style={[
                    styles.aiCheckbox,
                    aiSelectedIndexes.has(i) && styles.aiCheckboxSelected,
                  ]}
                >
                  {aiSelectedIndexes.has(i) && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[
              styles.aiSaveSelectedBtn,
              aiSelectedIndexes.size === 0 && { opacity: 0.5 },
            ]}
            onPress={handleSaveAiPhotos}
            disabled={aiSelectedIndexes.size === 0}
          >
            <Text style={styles.btnText}>
              Save Selected ({aiSelectedIndexes.size})
            </Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* AI Photo Generator — always on top */}
        {renderAiPhotoSection()}

        {/* Select Dropdowns — 2x2 grid */}
        <Text style={styles.sectionTitle}>Product Options</Text>
        <View style={styles.row}>
          <SelectDropdown
            label="Material"
            apiUrl="v1/asset/product_material"
            iterator={SELECT_ITERATOR}
            value={material}
            onChange={setMaterial}
            required
            hasError={!!selectErrors.material}
          />
          <SelectDropdown
            label="Type"
            apiUrl="v1/asset/product_type"
            iterator={SELECT_ITERATOR}
            value={productType}
            onChange={setProductType}
            required
            hasError={!!selectErrors.productType}
          />
        </View>
        <View style={[styles.row, { marginTop: 10 }]}>
          <SelectDropdown
            label="Gem"
            apiUrl="v1/asset/product_gem_type"
            iterator={SELECT_ITERATOR}
            value={gemType}
            onChange={setGemType}
          />
          <View style={styles.labourContainer}>
            <Text style={styles.label}>Labour</Text>
            <View style={styles.labourInput}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.labourField}
                placeholder="0.00"
                placeholderTextColor="#868e96"
                value={labour}
                onChangeText={setLabour}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        {/* Description Images — create mode only */}
        {!isEditMode && (
          <>
            <Text style={styles.sectionTitle}>
              Description Images ({descriptionImageUris.length})
            </Text>
            <View style={styles.imageRow}>
              {descriptionImageUris.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.thumbImage} />
              ))}
              <TouchableOpacity
                style={styles.addImageBtn}
                onPress={() => openImagePicker('description')}
              >
                <Text style={styles.addImageText}>+</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Product Images */}
        <Text style={styles.sectionTitle}>
          Product Images ({productImages.length})
        </Text>
        <View style={styles.imageRow}>
          {productImages.map((url, i) => (
            <Image key={i} source={{ uri: url }} style={styles.thumbImage} />
          ))}
          <TouchableOpacity
            style={styles.addImageBtn}
            onPress={() => openImagePicker('product')}
          >
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Phase 2: Form fields + descriptions (after AI) */}
        {!aiLoading && (
          <>
            <Text style={styles.sectionTitle}>Product Details</Text>

            {/* Title */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Title <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Product title"
                placeholderTextColor="#868e96"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.row}>
              {/* Color */}
              <View style={[styles.fieldGroup, styles.halfInput]}>
                <Text style={styles.fieldLabel}>Color</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Gold"
                  placeholderTextColor="#868e96"
                  value={color}
                  onChangeText={setColor}
                />
              </View>
              {/* Weight */}
              <View style={[styles.fieldGroup, styles.halfInput]}>
                <Text style={styles.fieldLabel}>
                  Weight <Text style={styles.required}>*</Text>{' '}
                  <Text style={styles.unitLabel}>oz</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#868e96"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.row}>
              {/* Height */}
              <View style={[styles.fieldGroup, styles.halfInput]}>
                <Text style={styles.fieldLabel}>
                  Height <Text style={styles.required}>*</Text>{' '}
                  <Text style={styles.unitLabel}>in</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#868e96"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="decimal-pad"
                />
              </View>
              {/* Width */}
              <View style={[styles.fieldGroup, styles.halfInput]}>
                <Text style={styles.fieldLabel}>
                  Width <Text style={styles.required}>*</Text>{' '}
                  <Text style={styles.unitLabel}>in</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#868e96"
                  value={width}
                  onChangeText={setWidth}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.row}>
              {/* Length */}
              <View style={[styles.fieldGroup, styles.halfInput]}>
                <Text style={styles.fieldLabel}>
                  Length <Text style={styles.required}>*</Text>{' '}
                  <Text style={styles.unitLabel}>in</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#868e96"
                  value={length}
                  onChangeText={setLength}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={{ flex: 1 }} />
            </View>

            {/* Tags */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Tags ({tags.length})
              </Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag, i) => (
                  <View key={i} style={styles.tagPill}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() => setTags((prev) => prev.filter((_, idx) => idx !== i))}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Text style={styles.tagClose}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.tagInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Add a tag..."
                  placeholderTextColor="#868e96"
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={() => {
                    const trimmed = tagInput.trim();
                    if (trimmed && !tags.includes(trimmed)) {
                      setTags((prev) => [...prev, trimmed]);
                    }
                    setTagInput('');
                  }}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.tagAddBtn}
                  onPress={() => {
                    const trimmed = tagInput.trim();
                    if (trimmed && !tags.includes(trimmed)) {
                      setTags((prev) => [...prev, trimmed]);
                    }
                    setTagInput('');
                  }}
                >
                  <Text style={styles.tagAddText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description cards — selectable + editable */}
            {descriptions.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  Descriptions <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.hint}>Select a description</Text>
                {descriptions.map((desc, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.descCard,
                      selectedDescIndex === i && styles.descCardSelected,
                    ]}
                    onPress={() => setSelectedDescIndex(i)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.descHeader}>
                      <View
                        style={[
                          styles.radio,
                          selectedDescIndex === i && styles.radioSelected,
                        ]}
                      >
                        {selectedDescIndex === i && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text style={styles.descLabel}>Option {i + 1}</Text>
                    </View>
                    <TextInput
                      style={styles.descInput}
                      value={desc}
                      onChangeText={(text) => {
                        setDescriptions((prev) => {
                          const updated = [...prev];
                          updated[i] = text;
                          return updated;
                        });
                      }}
                      multiline
                      textAlignVertical="top"
                    />
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom buttons */}
      {(hasDescriptionImage || isEditMode) && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.cancelAction} onPress={handleCancel}>
            <Text style={styles.cancelActionText}>Cancel</Text>
          </TouchableOpacity>
          {aiLoading && !isEditMode ? (
            <TouchableOpacity
              style={[styles.descriptionBtn, isFetching && { opacity: 0.7 }]}
              onPress={handleDescriptionPress}
              disabled={isFetching}
            >
              {isFetching ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Description</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.toDbBtn, isSaving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>{isEditMode ? 'Save' : 'To Db'}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* Web action sheet for Camera / Gallery */}
      {IS_WEB && pickerTarget === 'ai-raw' && (
        <View style={styles.actionSheetBackdrop}>
          <View style={styles.actionSheet}>
            <Text style={styles.actionSheetTitle}>Add Photos</Text>
            {pickerTarget === 'ai-raw' && (
              <TouchableOpacity
                style={styles.actionSheetBtn}
                onPress={() => {
                  setPickerTarget(null);
                  webTargetRef.current = 'ai-raw';
                  openCamera('product');
                }}
              >
                <Ionicons name="camera-outline" size={20} color="#fff" />
                <Text style={styles.actionSheetBtnText}>Camera</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionSheetBtn}
              onPress={() => {
                const target = pickerTarget;
                setPickerTarget(null);
                openWebFilePicker(target);
              }}
            >
              <Ionicons name="images-outline" size={20} color="#fff" />
              <Text style={styles.actionSheetBtnText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionSheetBtn, styles.actionSheetCancel]}
              onPress={() => setPickerTarget(null)}
            >
              <Text style={styles.actionSheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b1e',
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    color: '#c1c2c5',
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  fieldGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    color: '#c1c2c5',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  unitLabel: {
    color: '#868e96',
    fontSize: 12,
    fontWeight: '400',
  },
  required: {
    color: '#e03131',
  },
  hint: {
    color: '#868e96',
    fontSize: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  // Labour input
  labourContainer: {
    flex: 1,
  },
  labourInput: {
    backgroundColor: '#25262b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#373a40',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
    overflow: 'hidden',
  },
  dollarSign: {
    color: '#868e96',
    fontSize: 15,
    marginRight: 4,
  },
  labourField: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    height: 46,
    padding: 0,
  },
  // Images
  imageButton: {
    backgroundColor: '#25262b',
    borderRadius: 10,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#373a40',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    color: '#868e96',
    fontSize: 16,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  thumbImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  addImageBtn: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#25262b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#373a40',
    borderStyle: 'dashed',
  },
  addImageText: {
    color: '#868e96',
    fontSize: 24,
  },
  // Form inputs
  input: {
    backgroundColor: '#25262b',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#373a40',
    height: 46,
    overflow: 'hidden',
  },
  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2e33',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: '#373a40',
  },
  tagText: {
    color: '#c1c2c5',
    fontSize: 13,
  },
  tagClose: {
    color: '#868e96',
    fontSize: 12,
    fontWeight: '600',
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  tagAddBtn: {
    backgroundColor: '#228be6',
    width: 46,
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagAddText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  // Description cards
  descCard: {
    backgroundColor: '#25262b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  descCardSelected: {
    borderColor: '#228be6',
  },
  descHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#868e96',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: '#228be6',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#228be6',
  },
  descLabel: {
    color: '#c1c2c5',
    fontSize: 14,
    fontWeight: '500',
  },
  descInput: {
    color: '#c1c2c5',
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: '#1a1b1e',
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#373a40',
  },
  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    backgroundColor: '#1a1b1e',
    borderTopWidth: 1,
    borderTopColor: '#25262b',
  },
  cancelAction: {
    flex: 1,
    backgroundColor: '#e03131',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  cancelActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionBtn: {
    flex: 1,
    backgroundColor: '#228be6',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  toDbBtn: {
    flex: 1,
    backgroundColor: '#0ca678',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // AI Photo Generator
  aiRawThumbWrap: {
    position: 'relative',
  },
  aiRawRemoveBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#1a1b1e',
    borderRadius: 10,
  },
  aiRawUploadIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiGenerateBtn: {
    backgroundColor: '#7950f2',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  aiCheckbox: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCheckboxSelected: {
    backgroundColor: '#228be6',
    borderColor: '#228be6',
  },
  aiSaveSelectedBtn: {
    backgroundColor: '#0ca678',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  // Web action sheet
  actionSheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  actionSheet: {
    backgroundColor: '#2c2e33',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 32,
    gap: 4,
  },
  actionSheetTitle: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  actionSheetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#373a40',
  },
  actionSheetBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  actionSheetCancel: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginTop: 4,
  },
  actionSheetCancelText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
});
