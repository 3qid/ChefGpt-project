const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  // مصفوفة تحتوي على كل الرسائل بالترتيب الزمني
  messages: [
    {
      role: { 
        type: String, 
        enum: ['user', 'ai'], // تحديد من أرسل الرسالة
        required: true 
      },
      text: { 
        type: String, 
        required: true 
      },
      createdAt: { 
        type: Date, 
        default: Date.now // يسجل الوقت تلقائياً عند إضافة الرسالة
      }
    }
  ],
  title: { 
    type: String, 
    default: "New Cooking Chat" 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);