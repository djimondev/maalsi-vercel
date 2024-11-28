import { VideoCard } from "./VideoCard";

export const VideoList = ({ loading, videos, setSelectedVideo }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center mt-12">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }
    if (!videos.length) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-600">Pas de résultats trouvés</h2>
                <p className="text-gray-500 mt-2">Essayez de chercher un autre titre de vidéo</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map(video => (
                <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
            ))}
        </div>
    );
};
