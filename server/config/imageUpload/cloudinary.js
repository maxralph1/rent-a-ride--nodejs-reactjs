const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// Upload
// const cloudinaryImageUpload = cloudinary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg', {public_id: "olympic_flag"});

// const cloudinaryImageUpload = (image, folderName, imageWidth, cropValue) => cloudinary.uploader.upload(image, { 
//     folder: folderName,
//     width: imageWidth,
//     crop: cropValue
// });

const cloudinaryImageUpload = (image, folderName) => cloudinary.uploader.upload(image, { 
    folder: folderName
});


module.exports = cloudinaryImageUpload;


// cloudinaryImageUpload.then((data) => {
//   console.log(data);
//   console.log(data.secure_url);
// }).catch((err) => {
//   console.log(err);
// });


// // Generate 
// const url = cloudinary.url("olympic_flag", {
//   width: 100,
//   height: 150,
//   Crop: 'fill'
// });


// // The output url
// console.log(url);
// // https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag