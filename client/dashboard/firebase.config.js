// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


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
export const analytics = getAnalytics(app);

//login to admin account on firebase - admin account can read/write realtime DB
const auth = getAuth(app);
let cachedUser;
export const getFirebaseUser = async () => {
    if (!cachedUser)
        cachedUser = (await signInWithEmailAndPassword(auth,
            import.meta.env.VITE_FIREBASE_ADMIN_USER,
            import.meta.env.VITE_FIREBASE_ADMIN_PASS)).user
    return cachedUser;
}
getFirebaseUser();

export const rtDB = getDatabase(app)