import firebase from "firebase";
// const firebase = require("firebase");

const firebaseConfig = {
    apiKey: "AIzaSyBRpNCWi066AaAMbWJku-YwBY5lu30pYT4",
    authDomain: "speech-reco-93bb6.firebaseapp.com",
    projectId: "speech-reco-93bb6",
    storageBucket: "speech-reco-93bb6.appspot.com",
    messagingSenderId: "499915140234",
    appId: "1:499915140234:web:ea6528d01c4a6df4ec9173",
    measurementId: "G-ZWQXGPLLX3",
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;
