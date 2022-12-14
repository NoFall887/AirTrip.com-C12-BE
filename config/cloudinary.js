const cloudinary = require("cloudinary").v2;
// read env variable from .env file if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

module.exports = cloudinary;
