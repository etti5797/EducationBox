import { useEffect, useState } from "react";
import { db } from '../services/firestore';
import { collection, getDocs } from "firebase/firestore";

const SharedMaterials = () => {
    const [sharedMaterials, setSharedMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSharedMaterials = async () => {
            try {
                const usersRef = collection(db, 'users');
                const usersSnapshot = await getDocs(usersRef);
                
                let allSharedMaterials = [];

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

    
    const filteredMaterials = sharedMaterials.filter(file =>
        file.fileOriginalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        || file.uploadedBy?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="shared-materials">
            <div className="shared-materials-content">
                <input 
                    type="text"
                    placeholder="Search by name, description, tags, or uploader"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                {loading ? (
                    <p className="loading">Loading...</p>
                ) : (
                    <div className="shared-materials-list">
                        {filteredMaterials.length > 0 ? (
                            filteredMaterials.map((material) => (
                                <div key={material.id} className="file-card">
                                    <h2>{material.fileOriginalName}</h2>
                                    <p><strong>Description:</strong> {material.description || "No description"}</p>
                                    <p><strong>Tags:</strong> {material.tags?.join(', ') || "No tags"}</p>
                                    <p><strong>Uploaded by:</strong> {material.uploadedBy}</p>
                                    <a href={material.downloadURL} target="_blank" rel="noopener noreferrer">View</a>
                                </div>
                            ))
                        ) : (
                            <>
                            {sharedMaterials.length > 0 ? (
                                <p className="error">No materials found matching your search criteria</p>
                            ) : (
                                <p>No shared materials available at the moment</p>
                            )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SharedMaterials;
