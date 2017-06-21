import * as firebase from 'firebase'
const config = {
  apiKey: "AIzaSyDHtULsenSRDeiUPDlAISVi1YJ1gM-wcPA",
  authDomain: "gulugulu-cbf48.firebaseapp.com",
  databaseURL: "https://gulugulu-cbf48.firebaseio.com",
  projectId: "gulugulu-cbf48",
  storageBucket: "gulugulu-cbf48.appspot.com",
  messagingSenderId: "256794078216"
};
firebase.initializeApp(config);
const database = firebase.database()
export default database
