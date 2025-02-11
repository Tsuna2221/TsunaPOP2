import 'dotenv/config'

export const firebaseConfig = {
  databaseURL: process.env.databaseURL,
  apiKey: process.env.apiKey, 
  authDomain: process.env.authDomain, 
  projectId: process.env.projectId, 
  storageBucket: process.env.storageBucket, 
  messagingSenderId: process.env.messagingSenderId, 
  appId: process.env.appId
};