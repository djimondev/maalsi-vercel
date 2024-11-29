import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import UploadButton from "./components/UploadButton";
import { VideoList } from "./components/VideoList";
import { VideoPlayer } from "./components/VideoPlayer";
import VideoUploadModal from "./components/VideoUploadModal";
import "./index.css";
import {
  createVideo,
  getVideos,
  reportVideo,
  updateVideoReaction,
} from "./services/video-service";

function App() {
  const [videos, setVideos] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    getVideos()
      .then((initialData) => {
        const data = initialData.filter(
          (video) => !video.reported_by?.includes(user?.id),
        );

        setVideos(data);
        setFilteredResults(data);
      })
      .finally(() => setLoading(false));
  }, [isLoaded, user]);

  const filterResults = (query) => {
    const filteredVideos =
      videos.filter(
        (video) =>
          video.title.toLowerCase().includes(query.toLowerCase()) ||
          video.channel.toLowerCase().includes(query.toLowerCase()),
      ) || [];
    setFilteredResults(filteredVideos);
  };

  const handleUploadComplete = (videoData) => {
    createVideo(videoData).then((data) => {
      setVideos((prevVideos) => [...prevVideos, data]);
      setFilteredResults((prevVideos) => [...prevVideos, data]);
    });
  };

  const handleLikeVideo = async (videoId) => {
    const updatedVideo = await updateVideoReaction(videoId, user?.id, "like");
    if (!updatedVideo) return;

    setVideos((prev) =>
      prev.map((video) =>
        video.id === updatedVideo.id ? updatedVideo : video,
      ),
    );
    setFilteredResults((prev) =>
      prev.map((video) =>
        video.id === updatedVideo.id ? updatedVideo : video,
      ),
    );
    setSelectedVideo(updatedVideo);
  };

  const handleDislikeVideo = async (videoId) => {
    const updatedVideo = await updateVideoReaction(
      videoId,
      user?.id,
      "dislike",
    );
    if (!updatedVideo) return;

    setVideos((prev) =>
      prev.map((video) =>
        video.id === updatedVideo.id ? updatedVideo : video,
      ),
    );
    setFilteredResults((prev) =>
      prev.map((video) =>
        video.id === updatedVideo.id ? updatedVideo : video,
      ),
    );
    setSelectedVideo(updatedVideo);
  };

  const handleReportVideo = async (videoId) => {
    if (!confirm("Êtes-vous sur de vouloir signaler cette vidéo ?")) return;

    const updatedVideo = await reportVideo(videoId, user?.id);
    if (!updatedVideo) return;

    setVideos((prev) => prev.filter((video) => video.id !== videoId));
    setFilteredResults((prev) => prev.filter((video) => video.id !== videoId));
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={filterResults} />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <UploadButton onClick={() => setShowUploadModal(true)} />
        <VideoList
          loading={loading}
          videos={filteredResults}
          setSelectedVideo={setSelectedVideo}
        />
      </main>
      {selectedVideo && (
        <VideoPlayer
          url={selectedVideo.url}
          title={selectedVideo.title}
          channel={selectedVideo.channel}
          views={selectedVideo.views}
          timestamp={selectedVideo.timestamp}
          description={selectedVideo.description}
          likes={selectedVideo.liked_by?.length || 0}
          dislikes={selectedVideo.disliked_by?.length || 0}
          hasLiked={selectedVideo.liked_by?.includes(user?.id)}
          hasDisliked={selectedVideo.disliked_by?.includes(user?.id)}
          onLike={() => handleLikeVideo(selectedVideo.id)}
          onDislike={() => handleDislikeVideo(selectedVideo.id)}
          onReport={() => handleReportVideo(selectedVideo.id)}
          onClose={() => setSelectedVideo(null)}
        />
      )}
      {showUploadModal && (
        <VideoUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
}

export default App;
