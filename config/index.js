const { initializeApp,  cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount= require("../edsa.json");
const {storage}  = require("firebase-admin");
const {getStorage, Storage} = require("firebase-admin/storage");

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();



module.exports ={ db,Timestamp, FieldValue, getStorage, storage };