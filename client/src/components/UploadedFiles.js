import React, { useState, useEffect } from 'react';
import { db } from '../services/firestore';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileAlt } from 'react-icons/fa';
import { deleteFile } from '../services/deleteFile';

const UploadedFiles = ({ userEmail }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userEmail) {
      const fetchFiles = async () => {
        try {
          const filesRef = collection(db, 'users', userEmail, 'files');
          const fileSnapshot = await getDocs(filesRef);
          const fileList = fileSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setFiles(fileList);
        } catch (error) {
          console.error("Error fetching files:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchFiles();
    }
  }, [userEmail]);

  const handleShareChange = async (fileId, currentState) => {
    const fileRef = doc(db, 'users', userEmail, 'files', fileId);
    const newSharedState = !currentState;

    await updateDoc(fileRef, { isShared: newSharedState });

    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId ? { ...file, isShared: newSharedState } : file
      )
    );
  };

  const handleDelete = async (fileName, fileURL) => {
    try {
      await deleteFile(userEmail, fileName, fileURL);
      setFiles(files.filter(file => file.fileName !== fileName));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return <FaFilePdf />;
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return <FaFileWord />;
    if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return <FaFilePowerpoint />;
    return <FaFileAlt />;
  };

  return (
    <div>
      <h3>Your Uploaded Files</h3>
      {loading ? (
        <p>Loading your files...</p>
      ) : files.length > 0 ? (
        files.map((file) => (
          <div key={file.id} className="file-card">
            <div>{getFileIcon(file.fileType)}</div>
            <div>
              <h4>{file.fileName}</h4>
              <p>{file.description}</p>
              <a href={file.downloadURL} target="_blank" rel="noopener noreferrer">View</a>
              <p>Tags: {file.tags.join(', ')}</p>
              <p>
                Shared: {file.isShared ? '✅' : '❌'}
                <button onClick={() => handleShareChange(file.id, file.isShared)}>
                  {file.isShared ? 'Unshare' : 'Share'}
                </button>
              </p>
              <button onClick={() => handleDelete(file.fileName, file.downloadURL)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>No files uploaded yet</p>
      )}
    </div>
  );
};

export default UploadedFiles;
