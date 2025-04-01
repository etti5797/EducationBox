import React, { useState } from 'react';
import { uploadFile } from '../services/uploadFile'; 
import { db } from '../services/firestore'; 
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const UploadFiles = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [msg, setMsg] = useState(null);
  

  // Only logged in user can upload files - the user's email is definitely stored in the local storage
  const userEmail = getAuth().currentUser.email;


  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]); // Set the file when the user selects one
    }
  };

  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      try {
        // Upload the file to Firebase Storage and get the URL
        const url = await uploadFile(file, userEmail); 

        // Create a reference to the user's document
        const userRef = doc(db, "users", userEmail); 
        const userDoc = await getDoc(userRef); // Check if the document exists

        // If the user document does not exist, create it
        if (!userDoc.exists()) {
          await setDoc(userRef, { email: userEmail });
        }

        // Create a reference to the user's sub-collection for files
        const filesRef = collection(userRef, "files");

        // Save the file metadata (including the download URL) to Firestore
        await addDoc(filesRef, {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          downloadURL: url, // Store the download URL from Firebase Storage
          uploadTime: new Date(), 
        });

        setDownloadURL(url);
        setUploading(false);
        setMsg("File uploaded successfully!");
      } catch (error) {
        setUploading(false);
        setMsg("Error uploading file: " + error.message);
      }
    } else {
      setMsg("Please select a file to upload");
    }
  };

  return (
    <>
      {msg ? <p>{msg}</p> : null}
      {downloadURL && <p>Download URL: <a href={downloadURL} target="_blank" rel="noopener noreferrer">Download</a></p>}
      <div>
        <h2>Upload your file</h2>
        <input type="file" accept=".pdf, .doc, .docx, .pptx" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
          Upload
        </button>
      </div>
      {uploading ? <p>Uploading...</p> : null}
    </>
  );
};

export default UploadFiles;
