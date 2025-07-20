const express = require('express');
const router = express.Router();
const { uploadDocument, getMyDocuments, getDocumentById, shareDocument } = require('../controllers/DocumentController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/my-documents', getMyDocuments);
router.get('/:id', getDocumentById);
router.post('/share', shareDocument);

module.exports = router;