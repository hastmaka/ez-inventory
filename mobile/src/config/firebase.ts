import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB4Mjp8hqP5xRUNjUouyz-8Qwb0yKE4G3U',
  authDomain: 'ez-soft-97beb.firebaseapp.com',
  projectId: 'ez-soft-97beb',
  storageBucket: 'ez-soft-97beb.appspot.com',
  messagingSenderId: '427249715286',
  appId: '1:427249715286:web:4905d17c735178448e13f7',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
