import React, { useState } from 'react';
import { uploadFile } from '../services/uploadFile'; 
import { db } from '../services/firestore'; 
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

const UploadFiles = () => {
  
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [tags, setTags] = useState('');
  const [downloadURL, setDownloadURL] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const userEmail = user?.email;

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMsg("Please select a file to upload");
      return;
    }
    if(!description || description.trim() === '') {
      setMsg("Please add a description for the file");
      return;
    }
    if(!tags || tags.trim() === '') {
      setMsg("Please add tags for the file");
      return;
    }

    setMsg(null);

    setUploading(true);
    try {
      const uniqueFileName = `${file.name}-${Date.now()}`;
      const url = await uploadFile(file, userEmail, uniqueFileName);

      const userRef = doc(db, "users", userEmail); 
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, { email: userEmail });
      }

      const filesRef = collection(userRef, "files");
      
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());

      await addDoc(filesRef, {
        fileName: uniqueFileName,
        fileType: file.type,
        fileSize: file.size,
        downloadURL: url, 
        description: description,
        isShared: isShared,
        tags: tagArray, 
        uploadTime: new Date(),
      });

      setDownloadURL(url);
      setMsg("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setMsg("There was an error uploading the file");
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
        <h2>You must be logged in to upload files</h2>
      </div>
    );
  }

  return (
    <>
      <Link to={"/profile"} style={{ textDecoration: 'none' }}>
        <button>Back</button>
      </Link>
      {msg && <p>{msg}</p>}
      {downloadURL && (
        <p>
          Download URL: <a href={downloadURL} target="_blank" rel="noopener noreferrer">Download</a>
        </p>
      )}
      <div>
        <h2>Upload your file</h2>
        <input type="file" accept=".pdf, .doc, .docx, .pptx" onChange={handleFileChange} />
        <div>
          <label>
            Description:
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="file description" 
            />
          </label>
        </div>
        <div>
          <label>
            Tags (separate by commas):
            <input 
              type="text" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
              placeholder="e.g. purim, winter, games" 
            />
          </label>
        </div>
        <div>
          <label>
            Share with others:
            <input 
              type="checkbox" 
              checked={isShared} 
              onChange={() => setIsShared(prevState => !prevState)} 
            />
          </label>
        </div>
        <button onClick={handleUpload} disabled={uploading}>
          Upload
        </button>
      </div>
      {uploading && <p>Uploading...</p>}
    </>
  );
};

export default UploadFiles;
