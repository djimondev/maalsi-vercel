import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const s3Client = new S3Client({
    region: import.meta.env.VITE_S3_BUCKET_REGION,
    endpoint: import.meta.env.VITE_S3_BUCKET_ENDPOINT,
    credentials: {
        accessKeyId: import.meta.env.VITE_S3_BUCKET_KEY_ID,
        secretAccessKey: import.meta.env.VITE_S3_BUCKET_SECRET_ACCESS_KEY
    },
    forcePathStyle: true
});

export async function uploadToS3(videoFile, thumbnailFile) {
    try {
        // Get presigned URLs for both video and thumbnail
        const videoPresigned = await createPresignedPost(s3Client, {
            Bucket: import.meta.env.VITE_S3_BUCKET,
            Key: `videos/${Date.now()}-${videoFile.name}`,
            Conditions: [
                ["content-length-range", 0, 104857600] // Max 100MB
                // ["starts-with", "$Content-Type", "video/"]
            ]
        });

        const thumbnailPresigned = await createPresignedPost(s3Client, {
            Bucket: import.meta.env.VITE_S3_BUCKET,
            Key: `thumbnails/${Date.now()}-${thumbnailFile.name}`,
            Conditions: [
                ["content-length-range", 0, 5242880] // Max 5MB
                // ["starts-with", "$Content-Type", "image/"]
            ]
        });

        // Upload video
        const videoFormData = new FormData();
        Object.entries(videoPresigned.fields).forEach(([key, value]) => {
            videoFormData.append(key, value);
        });
        videoFormData.append("file", videoFile);

        const videoUpload = await fetch(videoPresigned.url, {
            method: "POST",
            body: videoFormData
        });

        if (!videoUpload.ok) {
            throw new Error("Failed to upload video");
        }

        // Upload thumbnail
        const thumbnailFormData = new FormData();
        Object.entries(thumbnailPresigned.fields).forEach(([key, value]) => {
            thumbnailFormData.append(key, value);
        });
        thumbnailFormData.append("file", thumbnailFile);

        const thumbnailUpload = await fetch(thumbnailPresigned.url, {
            method: "POST",
            body: thumbnailFormData
        });

        if (!thumbnailUpload.ok) {
            throw new Error("Failed to upload thumbnail");
        }

        // Return the URLs for both uploaded files
        return {
            videoUrl: `${videoPresigned.url}/${videoPresigned.fields.key}`,
            thumbnailUrl: `${thumbnailPresigned.url}/${thumbnailPresigned.fields.key}`
        };
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error;
    }
}
