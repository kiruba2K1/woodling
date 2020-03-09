 import Firebase from 'firebase';
 // import 'firebase/performance';

const firebaseConfig = {
  apiKey: "AIzaSyCmp8DHdiGRvjXVo5VeaGU5CFHbKZob-ao",
  authDomain: "woodlig-5b2d4.firebaseapp.com",
  databaseURL: "https://woodlig-5b2d4.firebaseio.com",
  projectId: "woodlig-5b2d4",
  storageBucket: "woodlig-5b2d4.appspot.com",
  messagingSenderId: "393765072696",
  appId: "1:393765072696:web:31630a4cb41125e0b3dbcd",
};

 export const firebase = Firebase.initializeApp(firebaseConfig);
 export const db = firebase.database();
 // export const perf = firebase.performance();
