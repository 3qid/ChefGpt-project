const Chat = require('../models/chat');
const mongoose = require('mongoose');

// 1. جلب كل المحادثات
const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({}).sort({ createdAt: -1 });
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 2. جلب محادثة واحدة فقط
const getChat = async (req, res) => {
    const { id } = req.params;

    // التحقق من صحة الـ ID لتجنب انهيار السيرفر
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such chat found' });
    }

    const chat = await Chat.findById(id);

    if (!chat) {
        return res.status(404).json({ error: 'No such chat found' });
    }

    res.status(200).json(chat);
};

// 3. إضافة محادثة جديدة
const createChat = async (req, res) => {
    const { user_id, prompt, aiResponse, recipes } = req.body;

    try {
        const chat = await Chat.create({ user_id, prompt, aiResponse, recipes });
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 4. حذف محادثة
const deleteChat = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such chat found' });
    }

    const chat = await Chat.findOneAndDelete({ _id: id });

    if (!chat) {
        return res.status(404).json({ error: 'No such chat found' });
    }

    res.status(200).json(chat);
};

// 5. تعديل محادثة
const updateChat = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such chat found' });
    }

    const chat = await Chat.findOneAndUpdate({ _id: id }, {
        ...req.body
    }, { new: true }); // new: true لكي يرجع البيانات بعد التعديل

    if (!chat) {
        return res.status(404).json({ error: 'No such chat found' });
    }

    res.status(200).json(chat);
};

// التصدير (تأكد من وجود كل الأسماء هنا)
module.exports = {
    getChats,
    getChat,
    createChat,
    deleteChat,
    updateChat
};