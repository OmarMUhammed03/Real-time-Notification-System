const documentRepo = require('../repositories/documentRepository');

async function createDocument({ file, ownerId, encrypted, encryptionMethod, tags }) {
    return await documentRepo.save({
        name: require('uuid').v4(),
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storageUrl: file.storageUrl,
        encrypted,
        encryptionMethod,
        owner: ownerId,
        tags,
    });
}

async function getDocumentsByUser(userId) {
    return await documentRepo.findByOwner(userId);
}

async function getDocumentById(docId, userId, ip) {
    const doc = await documentRepo.findById(docId);
    if (!doc) throw new Error('Document not found');

    if (!doc.owner.equals(userId) && !doc.sharedWith.some(s => s.user.equals(userId))) {
        throw new Error('Access denied');
    }

    await documentRepo.addAccessLog(docId, { user: userId, ip });
    return doc;
}

async function shareDocument(docId, sharedUserId, expiresAt) {
    return await documentRepo.shareWithUser(docId, sharedUserId, expiresAt);
}

module.exports = {
    createDocument,
    getDocumentsByUser,
    getDocumentById,
    shareDocument,
};
