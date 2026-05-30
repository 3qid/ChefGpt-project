const express = require('express');
const {
    getChats,
    getChat,
    createChat,
    deleteChat,
    updateChat
} = require('../controllers/chatController');

const requireAuth = require('../middleware/requireAuth');
const router = express.Router();


router.use(requireAuth)
// GET all chats
router.get('/', getChats);

// GET a single chat
router.get('/:id', getChat);

// POST a new chat
router.post('/', createChat);

// DELETE a chat
router.delete('/:id', deleteChat);

// UPDATE a chat
router.patch('/:id', updateChat);

module.exports = router;