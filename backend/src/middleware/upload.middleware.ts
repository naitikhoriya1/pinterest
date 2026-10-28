import multer from "multer";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter: (_req, file, cb) => {
    console.log("[upload.middleware] Inspecting uploaded file:", {
      originalName: file.originalname,
      mimetype: file.mimetype,
    });

    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      console.warn("[upload.middleware] ⚠️ Rejected non-image file:", file.mimetype);
      cb(new Error("Only image files are allowed"));
    }
  },
});

export const uploadToCloudinary = (
  buffer: Buffer,
  folder = "pinterest_pins"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    console.log(`[uploadToCloudinary] Streaming ${buffer.length} bytes to Cloudinary folder: '${folder}'...`);
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          console.error("[uploadToCloudinary] ❌ Cloudinary upload error:", error);
          return reject(error || new Error("Cloudinary upload failed"));
        }
        console.log("[uploadToCloudinary] ✅ Upload succeeded. Public ID:", result.public_id, "URL:", result.secure_url);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};
