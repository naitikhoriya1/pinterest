import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import { apiFetch } from "../lib/api";
import type { Pin } from "../types/pin";

/**
 * Splits comma-separated string, trims, lowercases, drops empties, de-duplicates, caps at 10.
 */
const parseTags = (raw: string): string[] => {
  const parts = raw.split(",");
  const seen = new Set<string>();
  const tags: string[] = [];

  for (const part of parts) {
    const clean = part.trim().toLowerCase();
    if (clean && !seen.has(clean)) {
      seen.add(clean);
      tags.push(clean.slice(0, 30));
      if (tags.length >= 10) break;
    }
  }

  return tags;
};

const Create = () => {
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const [previewStatus, setPreviewStatus] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadTokenRef = useRef(0);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextUrl = e.target.value;
    setImageUrl(nextUrl);
    setSubmitError(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = nextUrl.trim();
    if (!trimmed) {
      setPreviewStatus("idle");
      setDimensions(null);
      return;
    }

    setPreviewStatus("loading");

    debounceTimerRef.current = setTimeout(() => {
      // Validate well-formed http(s) URL
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(trimmed);
      } catch {
        setPreviewStatus("error");
        setDimensions(null);
        return;
      }

      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        setPreviewStatus("error");
        setDimensions(null);
        return;
      }

      const token = ++loadTokenRef.current;
      const img = new Image();
      img.referrerPolicy = "no-referrer";

      img.onload = () => {
        if (token !== loadTokenRef.current) return;
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          setDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          setPreviewStatus("loaded");
        } else {
          setPreviewStatus("error");
          setDimensions(null);
        }
      };

      img.onerror = () => {
        if (token !== loadTokenRef.current) return;
        setPreviewStatus("error");
        setDimensions(null);
      };

      img.src = trimmed;
    }, 500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      previewStatus !== "loaded" ||
      !dimensions ||
      !title.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim(),
      width: dimensions.width,
      height: dimensions.height,
      tags: parseTags(tagsInput),
    };

    try {
      await apiFetch<{ success: boolean; data: Pin }>("/api/pins", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      navigate("/dashboard");
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to create pin. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInsecure = imageUrl.trim().startsWith("http://");
  const isSubmitDisabled =
    previewStatus !== "loaded" || !title.trim() || isSubmitting;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Create a Pin</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Image Preview / URL Input */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition"
                  required
                />
              </div>

              {/* Insecure HTTP Warning */}
              {isInsecure && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">
                  <AlertTriangle size={16} className="flex-shrink-0 text-amber-600" />
                  <span>
                    This link isn't secure and may not display on some devices.
                  </span>
                </div>
              )}

              {/* Preview Box */}
              <div className="min-h-[280px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center overflow-hidden">
                {previewStatus === "idle" && (
                  <div className="text-gray-400 flex flex-col items-center gap-2">
                    <ImageIcon size={44} strokeWidth={1.5} />
                    <p className="text-xs font-medium">
                      Paste an image URL above to see a preview
                    </p>
                  </div>
                )}

                {previewStatus === "loading" && (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Loader2 size={32} className="animate-spin text-gray-700" />
                    <p className="text-xs font-medium">Loading preview...</p>
                  </div>
                )}

                {previewStatus === "loaded" && dimensions && (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <img
                      src={imageUrl.trim()}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="max-h-96 w-auto rounded-2xl object-contain shadow-sm"
                    />
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {dimensions.width} × {dimensions.height} px
                    </span>
                  </div>
                )}

                {previewStatus === "error" && (
                  <div className="text-red-600 flex flex-col items-center gap-2 max-w-xs p-4">
                    <AlertCircle size={32} />
                    <p className="text-xs font-medium">
                      Couldn't load that image. Check the link or try another.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Title, Description, Tags */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  maxLength={100}
                  placeholder="Add a title (max 100 characters)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition"
                  required
                />
                <div className="flex justify-end text-[11px] text-gray-400 mt-1">
                  {title.length}/100
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  maxLength={500}
                  placeholder="Tell everyone what your Pin is about (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition resize-none"
                />
                <div className="flex justify-end text-[11px] text-gray-400 mt-1">
                  {description.length}/500
                </div>
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Tags (comma-separated, max 10)
                </label>
                <input
                  id="tags"
                  type="text"
                  placeholder="e.g. nature, photography, travel"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Separate tags with commas. Max 10 tags, 30 characters each.
                </p>
              </div>

              {/* Inline Submit Error */}
              {submitError && (
                <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm transition flex items-center justify-center gap-2 ${
                    isSubmitDisabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#e60023] hover:bg-[#c9001e] text-white shadow-sm hover:shadow"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Pin</span>
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

export default Create;
