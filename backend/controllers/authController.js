const User = require("../models/User");
const jwt = require('jsonwebtoken');

// دالة إنشاء التوكن
// ✅ الكود المصحح لدالة إنشاء التوكن
const createToken = (_id) => {
    // 🔍 سيعلمنا هذا السطر إذا كان السيرفر يرى المفتاح أثناء التوقيع أم أنه undefined
    console.log("🔑 [userController] السيرفر يوقع التوكن الآن باستخدام المفتاح السري:", process.env.SECRET);
    
    return jwt.sign({ _id }, process.env.SECRET, { 
        expiresIn: '3d' 
    });
};

const handleErrors = (err) => {
    let errors = { email: '', password: '' };

    // المنطق الحرفي: إذا كانت البيانات خطأ، نملأ الخانتين بنفس الرسالة
    if (err.message === 'invalid email or password') {
        errors.email = 'invalid email or password';
        errors.password = 'invalid email or password'; // أضف هذا السطر هنا
        return errors;
    }

    // باقي الأكواد الخاصة بالـ 11000 والـ Validation تبقى كما هي
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

// دالة التسجيل
const signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.status(201).json({ user: user._id, email: user.email, name: user.name, token });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};
// دالة تسجيل الدخول الفعلية
const login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. استدعاء الدالة الثابتة التي أنشأناها في الموديل
        const user = await User.login(email, password);
        
        // 2. إنشاء التوكن (JWT) للمستخدم
        const token = createToken(user._id);

        // 3. (اختياري) إرسال التوكن في Cookie كما فعل Net Ninja لاحقاً
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });

        // 4. إرجاع استجابة النجاح مع ID المستخدم والتوكن
        res.status(200).json({ user: user._id, email: user.email, name: user.name, token });
    } 
    catch (err) {
        // 5. في حال فشل الدخول (إيميل خطأ أو باسورد خطأ)
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

// تحديث الملف الشخصي
const updateProfile = async (req, res) => {
    const { name } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name },
            { new: true }
        );
        res.status(200).json({ user: user._id, email: user.email, name: user.name });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// تصدير الدوال بشكل صحيح
module.exports = {
    signup_post,
    login_post,
    updateProfile
};