import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { db } from './firestore';  

const deleteFileFromFirestore = async (userEmail, fileName) => {
  try {
    // Reference to the user's file sub-collection
    const userRef = doc(db, 'users', userEmail);
    const filesRef = collection(userRef, 'files');

    // Query to find the document where fileName matches
    const q = query(filesRef, where("fileName", "==", fileName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming fileName is unique within the subcollection, we take the first document
      const fileDoc = querySnapshot.docs[0];
      await deleteDoc(fileDoc.ref);  // Delete the document from Firestore
      console.log('File document deleted from Firestore.');
    } else {
      console.log('No file found with that name.');
    }
  } catch (error) {
    console.error('Error deleting file from Firestore:', error);
    throw new Error('Error deleting file from Firestore');
  }
};

const deleteFileFromStorage = async (fileURL) => {
  try {
    const storage = getStorage();
    const fileRef = ref(storage, fileURL); // Assuming the file URL is the path to the file in Firebase Storage
    await deleteObject(fileRef);  // Delete the file from Firebase Storage
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error);
    throw new Error('Error deleting file from Firebase Storage');
  }
};

const deleteFile = async (userEmail, fileName, fileURL) => {
  try {
    // First, delete the file from Firebase Storage
    await deleteFileFromStorage(fileURL);

    // Then, delete the corresponding file metadata from Firestore
    await deleteFileFromFirestore(userEmail, fileName);

    console.log('File deleted successfully.');
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Error deleting file');
  }
};

export { deleteFile };
