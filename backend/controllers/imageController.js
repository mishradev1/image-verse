const Image = require('../models/Image');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');

exports.uploadImage = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create a new image document
    const image = new Image({
      title,
      description,
      url: result.secure_url,
      uploadedBy: req.user._id,
    });

    // Save the image document in the database
    await image.save();

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json(image);
  } catch (error) {
    console.error('Error uploading image:', error.message);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    // Fetch all images from the database and populate the 'uploadedBy' field with 'username'
    const images = await Image.find().populate('uploadedBy', 'username');

    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).json({ message: 'Failed to fetch images', error: error.message });
  }
};

exports.incrementViewCount = async (req, res) => {
  try {
    // Find the image by ID
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Increment the view count
    image.views += 1;

    // Save the updated image document
    await image.save();

    res.status(200).json({ views: image.views });
  } catch (error) {
    console.error('Error incrementing view count:', error.message);
    res.status(500).json({ message: 'Failed to increment view count', error: error.message });
  }
};
