const Chat = require('../models/chat');
const mongoose = require('mongoose');
const { GoogleGenAI } = require("@google/genai");

// تهيئة الاتصال بالـ API باستخدام المفتاح المخزن في الـ .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = "You are a professional chef and cooking assistant. ONLY answer questions about cooking, food, recipes, nutrition, kitchen techniques, and meal planning. If the user asks about anything outside of these topics (like sports, politics, technology, etc.), politely refuse and redirect them to ask about food and cooking.";

// GET all chats for the authenticated user
const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET a single chat
const getChat = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such chat found' });
    }

    try {
        const chat = await Chat.findOne({ _id: id, user: req.user._id });
        if (!chat) {
            return res.status(404).json({ error: 'No such chat found' });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =========================================================================
// 1. تعديل دالة إنشاء محادثة جديدة (إرسال أول رسالة واستقبال أول رد من Gemini)
// =========================================================================
const createChat = async (req, res) => {
    const { prompt } = req.body;

    try {
        let finalMessages = [];
        let finalTitle = "New Cooking Chat";

        if (prompt) {
            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash",
                contents: prompt,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION
                }
            });

            const aiResponseText = response.text;

            finalMessages = [
                { role: 'user', text: prompt },
                { role: 'ai', text: aiResponseText }
            ];

            finalTitle = prompt.substring(0, 30) + "...";
        }

        const chat = await Chat.create({
            title: finalTitle,
            messages: finalMessages,
            user: req.user._id
        });

        res.status(200).json(chat);

    } catch (error) {
        console.error("Gemini API Error (Create):", error);
        res.status(500).json({ error: error.message });
    }
};

// =========================================================================
// 2. تعديل دالة تحديث المحادثة (الرسائل المستمرة مع الحفاظ على ذاكرة وسياق الشات)
// =========================================================================
const updateChat = async (req, res) => {
    const { id } = req.params; // معرف المحادثة (Chat ID) القادم من الرابط
    const { text } = req.body; // الفرونت إند يرسل فقط نص الرسالة الجديدة هنا

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such chat found' });
    }

    if (!text) {
        return res.status(400).json({ error: 'Message text is required' });
    }

    try {
        // أ) جلب المحادثة الحالية من قاعدة البيانات للحصول على الرسائل السابقة
        const currentChat = await Chat.findOne({ _id: id, user: req.user._id });
        if (!currentChat) {
            return res.status(404).json({ error: 'No such chat found' });
        }

        // ب) بناء مصفوفة المحتوى الكاملة: التاريخ + الرسالة الجديدة
        const contents = [
            ...currentChat.messages.map(msg => ({
                role: msg.role === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            })),
            { role: 'user', parts: [{ text: text }] }
        ];

        // ج) إرسال كامل المحادثة (التاريخ + الرسالة الجديدة) إلى Gemini دفعة واحدة
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: contents,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION
            }
        });

        const aiResponseText = response.text;

        // هـ) دفع (Push) الرسالتين الجديدتين معاً في مصفوفة الرسائل بقاعدة البيانات
        const chat = await Chat.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { 
                $push: { 
                    messages: { 
                        $each: [
                            { role: 'user', text: text },
                            { role: 'ai', text: aiResponseText }
                        ]
                    } 
                } 
            },
            { new: true } // لإرجاع المستند المحدث فوراً للفرونت إند
        );

        res.status(200).json(chat);

    } catch (error) {
        console.error("Gemini API Error (Update):", error);
        res.status(500).json({ error: error.message });
    }
};

// DELETE a chat
const deleteChat = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such chat found' });
    }

    try {
        const chat = await Chat.findOneAndDelete({ _id: id, user: req.user._id });
        if (!chat) {
            return res.status(404).json({ error: 'No such chat found' });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getChats,
    getChat,
    createChat,
    deleteChat,
    updateChat
};