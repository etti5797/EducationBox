import React, { useState, useEffect } from 'react';
import { db } from '../services/firestore';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileAlt } from 'react-icons/fa';
import { deleteFile } from '../services/deleteFile';

const UploadedFiles = ({ userEmail}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredFiles = files.filter(file => 
    file.fileOriginalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    <div className='uploaded-files'>
      <input type="text"
        placeholder="Search files by tags, description, or name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
      {loading ? (
        <p className='loading'>Loading your files...</p>
      ) : filteredFiles.length > 0 ? (
        <div className="file-card-container">
        {
          filteredFiles.map((file) => (
            <div key={file.id} className="file-card">
              <div>{getFileIcon(file.fileType)}</div>
              <div>
                <h4>{file.fileOriginalName}</h4>
                <p>{file.description}</p>
                <a href={file.downloadURL} target="_blank" rel="noopener noreferrer">View</a>
                <p>Tags: {file.tags.join(', ')}</p>
                <p>
                  Shared: {file.isShared ? '✅' : '❌'}{" "}
                  <button className='share-unshare-button' onClick={() => handleShareChange(file.id, file.isShared)}>
                    {file.isShared ? 'Unshare' : 'Share'}
                  </button>
                </p>
                <button className='delete-file-button' onClick={() => handleDelete(file.fileName, file.downloadURL)}>Delete</button>
              </div>
            </div>
          ))
        }
        </div>) : (
        <>
          {files.length > 0 ? (
            <p className='error'>No files match your search criteria</p>
          ) : (
            <p>No files uploaded yet</p>
          )}
        </>
      )}
    </div>
  );
};

export default UploadedFiles;
