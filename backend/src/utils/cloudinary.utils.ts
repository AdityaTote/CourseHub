import { v2 as cloudinary } from "cloudinary";
import { cloudApiKey, cloudApiSecret, cloudName } from "../constant";

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudApiSecret,
});

export const uploadImage = async (file: any) => {
  try {
    if (!file) {
      return null;
    }

    const img = await cloudinary.uploader.upload(file);

    if (!img) {
      return null;
    }

    return img.url;
  } catch (error) {
    console.log(error);
    return null;
  }
};
