import 'dotenv/config'

require('dotenv').config()

export const firebaseConfig = {
  databaseURL: import.meta.env.databaseURL || process.env.databaseURL,
  apiKey: import.meta.env.apiKey || process.env.apiKey, 
  authDomain: import.meta.env.authDomain || process.env.authDomain, 
  projectId: import.meta.env.projectId || process.env.projectId, 
  storageBucket: import.meta.env.storageBucket || process.env.storageBucket, 
  messagingSenderId: import.meta.env.messagingSenderId || process.env.messagingSenderId, 
  appId: import.meta.env.appId || process.env.appId
};