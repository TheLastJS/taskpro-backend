import cloudinary from 'cloudinary';

export const saveFileToCloudinary = async (file) => {
  cloudinary.v2.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const response = await cloudinary.v2.uploader.upload(file.path);
  return response.secure_url;
};
