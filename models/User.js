const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    profile: {
        age: Number,
        weight: Number,
        height: Number ,
        calories: Number
    },
    
    activityLevel: { 
        type: String, 
        enum: ['sedentary', 'moderate', 'active'], 
        default: 'moderate'
    }
    
    
} , { timestamps: true }); // تأكد أن القوس ينتهي هنا بشكل صحيح

// تشفير كلمة المرور قبل الحفظ
// احذف next من البرامتر ومن داخل الدالة
userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    // لا نحتاج لـ next() هنا لأن الدالة async
});

const User = mongoose.model('user', userSchema);
module.exports = User;