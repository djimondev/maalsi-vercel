import { useUser } from "@clerk/clerk-react";
import { Upload, X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { uploadToFirebase } from "../services/video-service";

export default function VideoUploadModal({ onClose, onUploadComplete }) {
    const { user } = useUser();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = e => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith("video/")) {
            setFile(selectedFile);
            setError("");
        } else {
            setError("Please select a valid video file");
        }
    };

    const handleThumbnailChange = e => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setThumbnail(selectedFile);
            setError("");
        } else {
            setError("Please select a valid image file for thumbnail");
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!file || !thumbnail || !title || !description) {
            setError("Please fill in all fields");
            return;
        }

        setUploading(true);
        setError("");

        try {
            const { videoUrl, thumbnailUrl } = await uploadToFirebase(file, thumbnail);

            onUploadComplete({
                url: videoUrl,
                title,
                description,
                thumbnail: thumbnailUrl,
                channel: user.fullName
            });

            onClose();
        } catch (err) {
            setError("Failed to upload video. Please try again.");
            console.error("Upload error:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Upload Video</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Video Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            {file ? (
                                <div className="space-y-2">
                                    <p className="text-green-600">Selected: {file.name}</p>
                                    <button type="button" onClick={() => setFile(null)} className="text-red-500 hover:text-red-600">
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                                    <label className="block mt-2 cursor-pointer">
                                        <span className="text-blue-500 hover:text-blue-600">Select video to upload</span>
                                        <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            {thumbnail ? (
                                <div className="space-y-2">
                                    <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail preview" className="max-h-32 mx-auto" />
                                    <button type="button" onClick={() => setThumbnail(null)} className="text-red-500 hover:text-red-600">
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <label className="block cursor-pointer">
                                        <span className="text-blue-500 hover:text-blue-600">Select thumbnail image</span>
                                        <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter video title"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter video description"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

VideoUploadModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onUploadComplete: PropTypes.func.isRequired
};
