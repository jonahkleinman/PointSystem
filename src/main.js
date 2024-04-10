import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_KEY,
  authDomain: "ed-points.firebaseapp.com",
  projectId: "ed-points",
  storageBucket: "ed-points.appspot.com",
  messagingSenderId: "1084899208455",
  appId: "1:1084899208455:web:e2f06224245d075e63a9a2",
  measurementId: "G-0FXTZ3ZLXT"
};

initializeApp(firebaseConfig);
createApp(App).use(router).mount('#app')