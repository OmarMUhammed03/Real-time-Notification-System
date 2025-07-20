const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

/**
 * Upload a file to S3 under a user's personal folder (partition)
 * @param {Object} file - Multer file object
 * @param {string} userId - The owner's user ID
 */
async function uploadToS3(file, userId) {
    const fileContent = fs.readFileSync(file.path);
    const fileExt = path.extname(file.originalname);
    const uniqueFileName = `${Date.now()}_${file.originalname}`;
    const s3Key = `${userId}/${uniqueFileName}`; // Folder structure based on userId

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ContentType: file.mimetype,
    };

    const result = await s3.upload(params).promise();

    return {
        storageUrl: result.Location,
        s3Key,
    };
}

module.exports = { uploadToS3 };
