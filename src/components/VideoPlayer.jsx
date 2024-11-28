import { Flag, Share, ThumbsDown, ThumbsUp } from "lucide-react";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import { Header } from "./Header";

export const VideoPlayer = ({
    url,
    title,
    channel,
    views,
    timestamp,
    description,
    likes,
    dislikes,
    hasLiked,
    hasDisliked,
    onLike,
    onDislike,
    onReport,
    onClose
}) => {
    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <Header logoClick={onClose} hideSearchBar />

            <div className="max-w-6xl mx-auto p-4 pt-20">
                <div className="aspect-video w-full bg-black">
                    <ReactPlayer url={url} width="100%" height="100%" controls playing />
                </div>

                <div className="mt-4">
                    <h1 className="text-xl font-bold">{title}</h1>

                    <div className="flex flex-wrap items-center justify-between mt-2 pb-4 border-b">
                        <div>
                            <p className="font-semibold">{channel}</p>
                            <p className="text-sm text-gray-600">
                                {views} views • {timestamp}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-2 sm:mt-0">
                            <button
                                className={`flex items-center gap-1 px-3 py-2 rounded-full ${hasLiked ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
                                onClick={onLike}
                            >
                                <ThumbsUp className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} />
                                <span>Like ({likes})</span>
                            </button>
                            <button
                                className={`flex items-center gap-1 px-3 py-2 rounded-full ${hasDisliked ? "bg-red-100 text-red-600" : "hover:bg-gray-100"}`}
                                onClick={onDislike}
                            >
                                <ThumbsDown className={`w-5 h-5 ${hasDisliked ? "fill-current" : ""}`} />
                                <span>Dislike ({dislikes})</span>
                            </button>
                            <button className="flex items-center gap-1 hover:bg-gray-100 px-3 py-2 rounded-full">
                                <Share className="w-5 h-5" />
                                <span>Share</span>
                            </button>
                            <button className="flex items-center gap-1 hover:bg-gray-100 px-3 py-2 rounded-full" onClick={onReport}>
                                <Flag className="w-5 h-5" />
                                <span>Report</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 bg-gray-100 p-4 rounded-xl">
                        <p className="whitespace-pre-wrap">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

VideoPlayer.propTypes = {
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
    views: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    dislikes: PropTypes.number.isRequired,
    hasLiked: PropTypes.bool.isRequired,
    hasDisliked: PropTypes.bool.isRequired,
    onLike: PropTypes.func.isRequired,
    onDislike: PropTypes.func.isRequired,
    onReport: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};
