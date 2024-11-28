import PropTypes from 'prop-types';
import React from "react";

export const VideoCard = ({ video, onClick }) => {
    const { id, title, thumbnail, channel, views, timestamp } = video;

    return (
        <div className="flex flex-col cursor-pointer group" onClick={onClick}>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-400">
                {thumbnail !== "" ? (
                    <img src={thumbnail} alt={title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200" />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-300">
                        <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 3h18v12H3V3zm2 2v8h14V5H5z"></path>
                        </svg>
                    </div>
                )}
            </div>
            <div className="mt-3 px-1">
                <h3 className="text-sm font-semibold line-clamp-2">{`${id} - ${title}`}</h3>
                <p className="text-sm text-gray-600 mt-1">{channel}</p>
                <div className="text-sm text-gray-600">
                    <span>{views} views</span>
                    <span className="mx-1">•</span>
                    <span>{timestamp}</span>
                </div>
            </div>
        </div>
    );
};

VideoCard.propTypes = {
    video: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
        channel: PropTypes.string.isRequired,
        views: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired
    }).isRequired,
    onClick: PropTypes.func.isRequired
};