import { useEffect, useState } from "react";
import { db } from '../services/firestore';
import { collection, getDocs } from "firebase/firestore";

const SharedMaterials = () => {
    const [sharedMaterials, setSharedMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSharedMaterials = async () => {
            try {
                const usersRef = collection(db, 'users');
                const usersSnapshot = await getDocs(usersRef);
                
                const allSharedMaterials = [];

                for (const userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id; // Firestore document ID = user's email = userId
                   
                    const userFilesRef = collection(db, 'users', userId, 'files');
                    const userFilesSnapshot = await getDocs(userFilesRef);

                    const sharedFiles = userFilesSnapshot.docs
                        .map(fileDoc => ({
                            id: fileDoc.id,
                            ...fileDoc.data()
                        }))
                        .filter(file => file.isShared); // Only include shared files

                    allSharedMaterials.push(...sharedFiles);
                }

                setSharedMaterials(allSharedMaterials);
            } catch (error) {
                console.error("Error fetching shared materials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSharedMaterials();
    }, []);

    return (
        <div>
            <h1>Shared Materials</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="shared-materials-list">
                    {sharedMaterials.length > 0 ? (
                        sharedMaterials.map((material) => (
                            <div key={material.id} className="shared-material-item">
                                <h2>{material.fileOriginalName}</h2>
                                <p><strong>Description:</strong> {material.description}</p>
                                <p><strong>Tags:</strong> {material.tags?.join(', ')}</p>
                                <p><strong>Uploaded by:</strong> {material.uploadedBy}</p>
                                <a href={material.downloadURL} target="_blank" rel="noopener noreferrer">View</a>
                            </div>
                        ))
                    ) : (
                        <p>No shared materials available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SharedMaterials;
