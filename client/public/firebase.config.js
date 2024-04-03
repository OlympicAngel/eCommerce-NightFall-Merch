// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";


// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBSUUjeEuPI47YpKPzD6Envy-tI1ZZhf-Y",
    authDomain: "nightfall-merch.firebaseapp.com",
    databaseURL: "https://nightfall-merch-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "nightfall-merch",
    storageBucket: "nightfall-merch.appspot.com",
    messagingSenderId: "404887784388",
    appId: "1:404887784388:web:53bc7b5d1c3ffff7b33291",
    measurementId: "G-ZR51CXJSMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
signInAnonymously(auth)
let cachedUser;
export const getFirebaseUser = async () => {
    if (!cachedUser)
        cachedUser = (await signInAnonymously(auth)).user
    return cachedUser;
}
// Create a ReCaptchaEnterpriseProvider instance using your reCAPTCHA Enterprise
// site key and pass it to initializeAppCheck().
export const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RE_CAPTCHA_KEY),
    isTokenAutoRefreshEnabled: true
});

export const rtDB = getDatabase(app)