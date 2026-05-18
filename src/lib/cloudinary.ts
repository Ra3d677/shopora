import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Uploads a base64 string or file URL to Cloudinary
 * @param fileUri base64 image/video string (e.g. data:image/jpeg;base64,...) or remote URL
 * @param folder folder name in Cloudinary (e.g. "shopora")
 */
export async function uploadToCloudinary(fileUri: string, folder: string = "shopora") {
  try {
    // If the input is already a Cloudinary URL or remote non-base64 URL, return it as is
    if (fileUri.startsWith("http") && !fileUri.includes("data:") && fileUri.includes("cloudinary.com")) {
      return { success: true, url: fileUri, publicId: "" };
    }

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: folder,
      resource_type: "auto", // Automatically detects whether it is an image or video
    });
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error",
    };
  }
}
