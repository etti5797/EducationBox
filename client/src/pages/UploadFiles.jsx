import React, { useState } from 'react';
import { uploadFile } from '../services/uploadFile'; 
import { db } from '../services/firestore'; 
import { collection, addDoc, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

const UploadFiles = () => {

  // 1GB storage is free, so i limit the website for 6 users, each with 150MB of storage
  // so max storage for the website is 900MB
  const MAX_USER_STORAGE_BYTES = 150 * 1024 * 1024; 
  // const MAX_USER_STORAGE_BYTES =   400 * 1024; // 400KB for testing purposes
  const getUserUsedStorage = async (userEmail) => {
    const userRef = doc(db, "users", userEmail);
    const filesRef = collection(userRef, "files");
    const snapshot = await getDocs(filesRef);
    let totalBytes = 0;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.fileSize) {
        totalBytes += data.fileSize;
      }
    });
    return totalBytes;
  };
  
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [tags, setTags] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;
  const userEmail = user?.email;

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!file) {
      setErrorMsg("Please select a file to upload");
      return;
    }
    if(!description || description.trim() === '') {
      setErrorMsg("Please add a description for the file");
      return;
    }
    if(!tags || tags.trim() === '') {
      setErrorMsg("Please add tags for the file");
      return;
    }

    const usedStorage = await getUserUsedStorage(userEmail);
    if (usedStorage + file.size > MAX_USER_STORAGE_BYTES) {
      setErrorMsg("You have reached your free storage limit (225MB). Please delete some files before uploading more");
      setUploading(false);
      return;
    }

    setErrorMsg(null);

    setUploading(true);
    try {
      const uniqueFileName = `${Date.now()}-${file.name}`;
      const url = await uploadFile(file, userEmail, uniqueFileName);

      const userRef = doc(db, "users", userEmail); 
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, { email: userEmail });
      }

      const filesRef = collection(userRef, "files");
      
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== '');

      await addDoc(filesRef, {
        fileName: uniqueFileName,
        fileOriginalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        downloadURL: url, 
        description: description,
        isShared: isShared,
        tags: tagArray, 
        uploadedBy: user.displayName,
        uploadTime: new Date(),
      });

      setSuccessMsg("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMsg("There was an error uploading the file");
    } finally {
      setUploading(false);
      setFile(null);
      setDescription('');
      setIsShared(false);
      setTags('');
    }
  };

  if (!user) {
    return (
      <div>
        <h2 className='error'>You must be logged in to upload files</h2>
      </div>
    );
  }

  return (
    <>
      <Link to={"/profile"} style={{ textDecoration: 'none' }}>
        <button className='back-button'>Back</button>
      </Link>
      <div className='upload-file'>
        {errorMsg && <p className='error'>{errorMsg}</p>}
        {successMsg && <p className='success'>{successMsg}</p>}
        {uploading && <p className='loading'>Uploading...</p>}
        <h2>Upload your file</h2>
        <div className='file-info'>
          <label>file:</label>
          <input type="file" accept=".pdf, .doc, .docx, .pptx" onChange={handleFileChange} />
        </div>
        <div className='file-info'>
          <label>
            Description:
          </label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="file description"
          />
        </div>
        <div className='file-info'>
          <label>
            Tags (separate by commas):
          </label>
          <input 
            type="text" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="e.g. purim, winter, games" 
          />
        </div>
        <div className='file-info'>
          <label>
            Share with others:
          </label>
          <div className='checkbox-container'>
            <input 
              type="checkbox" 
              checked={isShared} 
              onChange={() => setIsShared(prevState => !prevState)} 
            />
          </div>
        </div>
        <button onClick={handleUpload} disabled={uploading}>
          Upload
        </button>
      </div>
  
    </>
  );
};

export default UploadFiles;
