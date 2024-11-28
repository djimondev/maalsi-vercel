import { useUser } from "@clerk/clerk-react";
import { Plus } from "lucide-react";
import PropTypes from 'prop-types';
import React from "react";

export default function UploadButton({ onClick }) {
    const { isSignedIn } = useUser();

    if (!isSignedIn) {
        return null;
    }

    return (
        <div className="mb-6">
            <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Plus className="w-5 h-5" />
                Upload Video
            </button>
        </div>
    );
}

UploadButton.propTypes = {
    onClick: PropTypes.func.isRequired
};