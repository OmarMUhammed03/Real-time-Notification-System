const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        storageUrl: {
            type: String,
            required: true,
        },
        encrypted: {
            type: Boolean,
            default: false,
        },
        encryptionMethod: {
            type: String,
            enum: ['AES', 'RSA', null],
            default: null,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sharedWith: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                expiresAt: { type: Date },
                accessToken: { type: String },
            },
        ],
        tags: [String],
        expiresAt: Date,
        accessLogs: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                accessedAt: { type: Date, default: Date.now },
                ip: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Document', documentSchema);
