import React, { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { X, Upload, Loader2, Tag } from "lucide-react";
import { api } from "../lib/api";
import type { Pin } from "../types/pin";

interface CreatePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPinCreated: (newPin: Pin) => void;
}

const CreatePinModal: React.FC<CreatePinModalProps> = ({
  isOpen,
  onClose,
  onPinCreated,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile: File) => {
    console.log("[CreatePinModal] File selected from device:", {
      name: selectedFile.name,
      sizeBytes: selectedFile.size,
      sizeMB: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB",
      type: selectedFile.type,
      lastModified: new Date(selectedFile.lastModified).toISOString(),
    });

    if (!selectedFile.type.startsWith("image/")) {
      const err = `Invalid file type (${selectedFile.type}). Please select an image file (JPEG, PNG, WebP, GIF)`;
      console.warn("[CreatePinModal] ⚠️ " + err);
      setError(err);
      return;
    }
    setError(null);
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    console.log("[CreatePinModal] Created local object preview URL:", objectUrl);
    setPreviewUrl(objectUrl);
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log("[CreatePinModal] File dropped into dropzone");
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      console.log("[CreatePinModal] Tag added:", trimmed);
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    console.log("[CreatePinModal] Tag removed:", tagToRemove);
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const resetForm = () => {
    setFile(null);
    if (previewUrl && !useUrlMode) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageUrlInput("");
    setTitle("");
    setDescription("");
    setTags([]);
    setTagInput("");
    setError(null);
    setUseUrlMode(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[CreatePinModal] Form submission triggered.", {
      title,
      description,
      tags,
      hasFile: Boolean(file),
      imageUrlInput,
      useUrlMode,
    });

    if (!title.trim()) {
      const err = "Please provide a title for your pin";
      console.warn("[CreatePinModal] Validation error: " + err);
      setError(err);
      return;
    }

    if (!file && !imageUrlInput.trim()) {
      const err = "Please upload an image file from your machine or enter an image URL";
      console.warn("[CreatePinModal] Validation error: " + err);
      setError(err);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let createdPin: Pin;

      if (file) {
        // Upload local file from user's machine to backend -> Cloudinary
        console.log("[CreatePinModal] Preparing FormData for multipart upload:", {
          fileName: file.name,
          title: title.trim(),
          tagsCount: tags.length,
        });

        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("tags", JSON.stringify(tags));

        console.log("[CreatePinModal] Uploading file to POST /api/pins (Cloudinary stream)...");
        const res = await api.upload<{ success: boolean; data: Pin }>("/api/pins", formData);
        console.log("[CreatePinModal] ✅ Pin created successfully via file upload:", res.data);
        createdPin = res.data;
      } else {
        // Upload from remote image URL
        console.log("[CreatePinModal] Sending POST /api/pins with remote URL:", imageUrlInput.trim());
        const res = await api.post<{ success: boolean; data: Pin }>("/api/pins", {
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrlInput.trim(),
          width: 800,
          height: 1200,
          tags,
        });
        console.log("[CreatePinModal] ✅ Pin created successfully via URL:", res.data);
        createdPin = res.data;
      }

      onPinCreated(createdPin);
      resetForm();
      onClose();
    } catch (err: any) {
      console.error("[CreatePinModal] ❌ Failed to create pin / upload to Cloudinary:", {
        error: err?.message || err,
      });
      setError(err?.message || "Failed to upload image to Cloudinary");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create Pin</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column: Image Upload / Dropzone */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Pin Image</span>
                <button
                  type="button"
                  onClick={() => {
                    setUseUrlMode(!useUrlMode);
                    setError(null);
                  }}
                  className="text-xs text-[#e60023] font-medium hover:underline"
                >
                  {useUrlMode ? "Upload local file" : "Upload via URL"}
                </button>
              </div>

              {useUrlMode ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrlInput}
                    onChange={(e) => {
                      setImageUrlInput(e.target.value);
                      setPreviewUrl(e.target.value);
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#e60023] focus:bg-white transition"
                  />
                  {previewUrl && (
                    <div className="relative aspect-[3/4] max-h-80 w-full rounded-2xl overflow-hidden border bg-gray-50">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => {
                          console.warn("[CreatePinModal] Image URL preview failed to load:", previewUrl);
                          setError("Could not load image preview from that URL");
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileInputChange}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="relative group rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-[3/4] max-h-96 flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-white text-gray-900 rounded-full font-medium text-xs hover:bg-gray-100 shadow transition"
                        >
                          Change Image
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            setPreviewUrl(null);
                          }}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow transition"
                          aria-label="Remove"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition
                        aspect-[3/4] max-h-96
                        ${isDragging ? "border-[#e60023] bg-red-50/40" : "border-gray-300 hover:border-gray-400 bg-gray-50/50"}
                      `}
                    >
                      <div className="p-4 bg-white rounded-full shadow-sm text-gray-600 mb-3">
                        <Upload size={28} className="text-[#e60023]" />
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        Choose a file or drag and drop it here
                      </p>
                      <p className="text-xs text-gray-400 mt-2 max-w-[200px]">
                        We recommend high quality .jpg or .png files up to 15MB
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right column: Form Details */}
            <div className="flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Add a title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-base font-medium outline-none focus:border-[#e60023] focus:bg-white transition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add a detailed description for what this pin is about"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:border-[#e60023] focus:bg-white transition resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tagged topics
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g. nature, photography"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#e60023] focus:bg-white transition"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-sm font-semibold transition"
                    >
                      Add
                    </button>
                  </div>

                  {/* Tag Chips */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-xs font-semibold transition"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-full font-semibold text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (!file && !imageUrlInput.trim()) || !title.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#e60023] hover:bg-[#c9001e] disabled:opacity-50 text-white rounded-full font-semibold text-sm shadow transition"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Uploading to Cloudinary…</span>
                    </>
                  ) : (
                    <span>Publish Pin</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePinModal;
