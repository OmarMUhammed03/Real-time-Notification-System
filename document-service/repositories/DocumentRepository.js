const Document = require('../models/Document');

async function save(documentData) {
    const document = new Document(documentData);
    return await document.save();
}

async function findById(docId) {
    return Document.findById(docId);
}

async function findByOwner(ownerId) {
    return Document.find({
        $or: [{ owner: ownerId }, { 'sharedWith.user': ownerId }],
    }).sort({ createdAt: -1 });
}

async function addAccessLog(docId, logEntry) {
    return Document.findByIdAndUpdate(
        docId,
        {$push: {accessLogs: logEntry}},
        {new: true}
    );
}

async function shareWithUser(docId, sharedUserId, expiresAt = null) {
    return Document.findByIdAndUpdate(
        docId,
        {
            $addToSet: {
                sharedWith: {user: sharedUserId, expiresAt},
            },
        },
        {new: true}
    );
}

module.exports = {
    save,
    findById,
    findByOwner,
    addAccessLog,
    shareWithUser,
};
