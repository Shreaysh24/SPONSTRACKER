"use client";

import {
  upload,
  ImageKitInvalidRequestError,
  ImageKitUploadNetworkError,
  ImageKitServerError,
  ImageKitAbortError,
} from "@imagekit/next";
import { useRef, useState } from "react";
import Image from "next/image";

const FileUpload = ({ onUploadComplete }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null); // "image" or "video"

  const validateFile = (file) => {
    const imageTypes = ["image/jpeg", "image/png", "image/webp"];
    const videoTypes = ["video/mp4", "video/webm", "video/ogg", "video/x-matroska"];

    if (imageTypes.includes(file.type)) {
      setFileType("image");
      return true;
    } else if (videoTypes.includes(file.type)) {
      setFileType("video");
      return true;
    }
    return false;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !validateFile(file)) {
      setError("❌ Invalid file type selected.");
      setPreviewUrl(null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const response = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        onProgress: (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      if (onUploadComplete) onUploadComplete(response.url);
    } catch (err) {
      if (err instanceof ImageKitInvalidRequestError) {
        setError("❌ Invalid request: " + err.message);
      } else if (err instanceof ImageKitUploadNetworkError) {
        setError("❌ Network error: " + err.message);
      } else if (err instanceof ImageKitServerError) {
        setError("❌ Server error: " + err.message);
      } else if (err instanceof ImageKitAbortError) {
        setError("❌ Upload aborted: " + err.message);
      } else {
        setError("❌ Unexpected error: " + err.message);
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-2xl shadow-lg space-y-4">
      <label
        htmlFor="fileInput"
        className="block text-center border-2 border-dashed border-gray-400 hover:border-blue-500 transition rounded-xl p-4 cursor-pointer text-gray-600 hover:text-blue-600 font-medium"
      >
        Click to Upload Image or Video
      </label>

      <input
        id="fileInput"
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl && fileType === "image" && (
        <Image
          src={previewUrl}
          alt="Preview"
          width={600}
          height={256}
          className="w-full max-h-64 object-cover rounded-xl shadow-md"
        />
      )}

      {previewUrl && fileType === "video" && (
        <video
          src={previewUrl}
          controls
          className="w-full max-h-64 rounded-xl shadow-md"
        />
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {progress > 0 && !uploading && (
        <p className="text-sm text-center text-gray-500">{progress}% Uploaded</p>
      )}

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
};

export default FileUpload;
