const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadToCloudinary = async (filePath, folder = 'dryclean') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: 'auto'
        });

        // Delete local file after upload
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

// Upload multiple images
const uploadMultipleToCloudinary = async (filePaths, folder = 'dryclean') => {
    const uploadPromises = filePaths.map(filePath => uploadToCloudinary(filePath, folder));
    return Promise.all(uploadPromises);
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

// Delete multiple images
const deleteMultipleFromCloudinary = async (publicIds) => {
    const deletePromises = publicIds.map(publicId => deleteFromCloudinary(publicId));
    return Promise.all(deletePromises);
};

// Get image URL with transformations
const getOptimizedUrl = (publicId, options = {}) => {
    const defaultOptions = {
        width: 500,
        height: 500,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto'
    };

    const mergedOptions = { ...defaultOptions, ...options };
    return cloudinary.url(publicId, mergedOptions);
};

// Upload base64 image
const uploadBase64Image = async (base64String, folder = 'dryclean') => {
    try {
        const result = await cloudinary.uploader.upload(base64String, {
            folder: folder,
            resource_type: 'auto'
        });

        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary base64 upload error:', error);
        throw error;
    }
};

// Get image info
const getImageInfo = async (publicId) => {
    try {
        const result = await cloudinary.api.resource(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary get info error:', error);
        throw error;
    }
};

module.exports = {
    uploadToCloudinary,
    uploadMultipleToCloudinary,
    deleteFromCloudinary,
    deleteMultipleFromCloudinary,
    getOptimizedUrl,
    uploadBase64Image,
    getImageInfo
};