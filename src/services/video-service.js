import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../config/firebase";

const VIDEOS_COLLECTION = "videos";

export const getVideos = async () => {
    const videosCol = collection(db, VIDEOS_COLLECTION);
    const videoSnapshot = await getDocs(videosCol);
    return videoSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const createVideo = async videoData => {
    const docRef = await addDoc(collection(db, VIDEOS_COLLECTION), {
        ...videoData,
        views: "0",
        timestamp: new Date().toISOString(),
        liked_by: [],
        disliked_by: [],
        reported_by: []
    });

    const newDoc = await getDoc(docRef);
    return {
        id: newDoc.id,
        ...newDoc.data()
    };
};

export const updateVideoReaction = async (videoId, userId, action) => {
    if (!userId) {
        alert("Vous devez être connecté.");
        return;
    }

    const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
    const videoSnap = await getDoc(videoRef);

    if (!videoSnap.exists()) {
        throw new Error("Video not found");
    }

    const videoData = videoSnap.data();
    const likedBy = new Set(videoData.liked_by || []);
    const dislikedBy = new Set(videoData.disliked_by || []);

    if (action === "like") {
        if (likedBy.has(userId)) {
            likedBy.delete(userId);
        } else {
            likedBy.add(userId);
            dislikedBy.delete(userId);
        }
    } else if (action === "dislike") {
        if (dislikedBy.has(userId)) {
            dislikedBy.delete(userId);
        } else {
            dislikedBy.add(userId);
            likedBy.delete(userId);
        }
    }

    const updatedData = {
        liked_by: Array.from(likedBy),
        disliked_by: Array.from(dislikedBy)
    };

    await updateDoc(videoRef, updatedData);

    const updatedSnap = await getDoc(videoRef);
    return {
        id: updatedSnap.id,
        ...updatedSnap.data()
    };
};

export const reportVideo = async (videoId, userId) => {
    if (!userId) {
        alert("Vous devez être connecté.");
        return;
    }

    const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
    const videoSnap = await getDoc(videoRef);

    if (!videoSnap.exists()) {
        throw new Error("Video not found");
    }

    const videoData = videoSnap.data();
    const reportedBy = new Set(videoData.reported_by || []);
    reportedBy.add(userId);

    const updatedData = {
        reported_by: Array.from(reportedBy)
    };

    await updateDoc(videoRef, updatedData);

    const updatedSnap = await getDoc(videoRef);
    return {
        id: updatedSnap.id,
        ...updatedSnap.data()
    };
};

export const uploadToFirebase = async (videoFile, thumbnailFile) => {
    try {
        // Upload video
        const videoRef = ref(storage, `videos/${Date.now()}-${videoFile.name}`);
        await uploadBytes(videoRef, videoFile);
        const videoUrl = await getDownloadURL(videoRef);

        // Upload thumbnail
        const thumbnailRef = ref(storage, `thumbnails/${Date.now()}-${thumbnailFile.name}`);
        await uploadBytes(thumbnailRef, thumbnailFile);
        const thumbnailUrl = await getDownloadURL(thumbnailRef);

        return {
            videoUrl,
            thumbnailUrl
        };
    } catch (error) {
        console.error("Error uploading to Firebase:", error);
        throw error;
    }
};
