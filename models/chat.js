const mongoose = require('mongoose'); // 👈 هذا السطر هو الذي يحل المشكلة، يجب أن يكون في البداية!

const chatSchema = new mongoose.Schema({
  prompt: { 
    type: String, 
    required: true 
  }, 
  aiResponse: { 
    type: String, 
    required: true 
  },
  recipes: [
    {
      title: String,
      calories: Number,
      instructions: [String], 
      ingredients: [String]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);