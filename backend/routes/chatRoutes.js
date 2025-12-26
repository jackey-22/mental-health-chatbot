const express = require('express');
const router = express.Router();
const { chatController } = require('../controllers/chatController');

// POST /api/chat - Send a message and get bot response
router.post('/', chatController);

module.exports = router;

