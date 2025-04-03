import { storage } from "./firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFile = async (file, userEmail, uniqueFileName) => {
  // Create a reference to the Firebase Storage location
  const fileRef = ref(storage, `user_files/${userEmail}/${uniqueFileName}`);
  try {
    // Upload the file to Firebase Storage. Specifies that we’re storing files inside a folder named user_files
    // return a snapshot that holds details about the uploaded file
    const snapshot = await uploadBytes(fileRef, file);
    // Get the download URL after the file is uploaded
    const downloadURL = await getDownloadURL(snapshot.ref); //snapshot.ref is a reference to the uploaded file (snapshot object contains metadata)
    console.log("File uploaded successfully! URL:", downloadURL);
    return downloadURL; // Return the URL where the file can be accessed
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
};
