import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA3ZSp1kIf061DO9ilLnEQiAtZNsXPa8Hk",
    authDomain: "kinobot-cb801.firebaseapp.com",
    projectId: "kinobot-cb801",
    storageBucket: "kinobot-cb801.appspot.com",
    messagingSenderId: "653783470503",
    appId: "1:653783470503:web:2ed97858be23d437052682"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
