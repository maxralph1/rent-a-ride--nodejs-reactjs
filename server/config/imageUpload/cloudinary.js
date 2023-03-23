const cloudinary = require('cloudinary').v2;

 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryImageUpload = (image, folderName) => cloudinary.uploader.upload(image, { 
    folder: folderName
});


module.exports = cloudinaryImageUpload;