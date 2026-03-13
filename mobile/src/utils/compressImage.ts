import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const MAX_DIMENSION = 920;
const JPEG_QUALITY = 0.8;

export async function compressImage(uri: string): Promise<string> {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: MAX_DIMENSION } }],
    { compress: JPEG_QUALITY, format: SaveFormat.JPEG },
  );
  return result.uri;
}
