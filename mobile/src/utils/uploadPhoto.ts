import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { compressImage } from './compressImage';

function createId(length = 20): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export interface UploadResult {
  name: string;
  url: string;
}

export async function uploadToFirebase(
  localUri: string,
  path: string,
): Promise<UploadResult> {
  const compressedUri = await compressImage(localUri);

  const response = await fetch(compressedUri);
  const blob = await response.blob();

  const name = createId();
  const storageRef = ref(storage, `${path}/${name}`);

  await uploadBytesResumable(storageRef, blob);
  const url = await getDownloadURL(storageRef);

  return { name, url };
}

export async function uploadPhoto(
  localUri: string,
  sessionId: string,
): Promise<UploadResult> {
  return uploadToFirebase(localUri, `photo-session/${sessionId}`);
}
