const documentService = require('../services/documentService');
const { uploadToS3 } = require('../services/s3Uploader');

/**
 * Upload a new document (with S3 and metadata)
 */
async function uploadDocument(req, res) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'File is required' });

        const s3Result = await uploadToS3(req.file, req.user.id);

        const document = await documentService.createDocument({
            file: {
                ...file,
                storageUrl: s3Result.storageUrl,
            },
            ownerId: req.user.id,
            encrypted: req.body.encrypted === 'true',
            encryptionMethod: req.body.encryptionMethod || null,
            tags: req.body.tags?.split(',') || [],
        });

        res.status(201).json(document);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

/**
 * Get all documents for the authenticated user
 */
async function getMyDocuments(req, res) {
    try {
        const documents = await documentService.getDocumentsByUser(req.user.id);
        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Get a specific document by ID
 */
async function getDocumentById(req, res) {
    try {
        const { id } = req.params;
        const doc = await documentService.getDocumentById(id, req.user.id, req.ip);
        res.json(doc);
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
}

/**
 * Share a document with another user
 */
async function shareDocument(req, res) {
    try {
        const { documentId, targetUserId, expiresAt } = req.body;

        const updated = await documentService.shareDocument(documentId, targetUserId, expiresAt);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    uploadDocument,
    getMyDocuments,
    getDocumentById,
    shareDocument,
};
