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
    name: {
        type: String,
        default: ''
    },
    profile: {
        age: Number,
        weight: Number,
        height: Number,
        calories: Number
    },
    // الحقول الجديدة لخدمة منطق ChefGPT والحساسية
    allergies: {
        type: [String],
        default: []
    },
    wantedFood: {
        type: [String],
        default: []
    },
    unwantedFood: {
        type: [String],
        default: []
    },
    activityLevel: { 
        type: String, 
        enum: ['sedentary', 'moderate', 'active'], 
        default: 'moderate'
    }
}, { timestamps: true });

// تشفير كلمة المرور قبل الحفظ تلقائياً
userSchema.pre('save', async function() {
    // التحقق مما إذا كانت كلمة المرور قد تم تعديلها لتجنب إعادة التشفير
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    
});
// دالة التحقق من بيانات الدخول
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        // الباسورد خطأ
        throw Error('invalid email or password');
    }
    // الإيميل غير موجود
    throw Error('invalid email or password');
};


const User = mongoose.model('user', userSchema);
module.exports = User;