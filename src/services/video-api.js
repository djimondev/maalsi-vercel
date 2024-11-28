const API_URL = import.meta.env.VITE_BASE_API_URL;

if (!API_URL) {
    throw new Error("Missing API_URL");
}

export const getVideos = async () => {
    const response = await fetch(`${API_URL}/videos`);
    const data = await response.json();
    return data;
};

export const createVideo = async videoData => {
    const response = await fetch(`${API_URL}/videos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(videoData)
    });
    const data = await response.json();
    return data;
};

export const updateVideoReaction = async (videoId, userId, action) => {
    if (!userId) {
        alert("Vous devez être connecté.");
        return;
    }

    const response = await fetch(`${API_URL}/videos/${videoId}`);
    const video = await response.json();

    const likedBy = new Set(video.liked_by);
    const dislikedBy = new Set(video.disliked_by);

    if (action === "like") {
        if (likedBy.has(userId)) {
            likedBy.delete(userId); // Annuler le like si déjà liké
        } else {
            likedBy.add(userId); // Ajouter le like
            dislikedBy.delete(userId); // Retirer des dislikes si présent
        }
    } else if (action === "dislike") {
        if (dislikedBy.has(userId)) {
            dislikedBy.delete(userId); // Annuler le dislike si déjà disliké
        } else {
            dislikedBy.add(userId); // Ajouter le dislike
            likedBy.delete(userId); // Retirer des likes si présent
        }
    }

    // Mise à jour sur le serveur
    const updatedVideo = {
        liked_by: Array.from(likedBy),
        disliked_by: Array.from(dislikedBy)
    };

    const patchResponse = await fetch(`${API_URL}/videos/${videoId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedVideo)
    });

    return await patchResponse.json();
};

export const reportVideo = async (videoId, userId) => {
    if (!userId) {
        alert("Vous devez être connecté.");
        return;
    }

    // Récupérer les informations actuelles de la vidéo
    const response = await fetch(`${API_URL}/videos/${videoId}`);
    const video = await response.json();

    const reportedBy = new Set(video.reported_by);

    reportedBy.add(userId); // Ajouter le report

    // Mise à jour sur le serveur
    const updatedVideo = {
        reported_by: Array.from(reportedBy)
    };

    const patchResponse = await fetch(`${API_URL}/videos/${videoId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedVideo)
    });

    return await patchResponse.json();
};
