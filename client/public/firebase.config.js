// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBSUUjeEuPI47YpKPzD6Envy-tI1ZZhf-Y",
    authDomain: "nightfall-merch.firebaseapp.com",
    projectId: "nightfall-merch",
    storageBucket: "nightfall-merch.appspot.com",
    messagingSenderId: "404887784388",
    appId: "1:404887784388:web:53bc7b5d1c3ffff7b33291",
    measurementId: "G-ZR51CXJSMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
