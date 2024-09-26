import { v2 as cloudinary } from "cloudinary";
import { cloudApiKey, cloudApiSecret, cloudName } from "../constant";
import fs from "fs";

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
      fs.unlinkSync(file);
      return null;
    }

    fs.unlinkSync(file);

    return img.url;
  } catch (error: any) {
    console.log(error);
    console.log(error.message);
    return null;
  }
};
