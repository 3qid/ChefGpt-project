const User = require('../models/User');


const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // duplicate email error (البريد مكرر)
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors (أخطاء التحقق)
  if (err.message.includes('user validation failed')) {
    // التغيير هنا: نستخدم Object.values للتأكد من الوصول لـ properties
    Object.values(err.errors).forEach(error => {
       // تأكد من الوصول لـ path و message مباشرة
       errors[error.properties.path] = error.properties.message;
    });
  }

  return errors;
}
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    res.status(201).json(user);
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  res.send('user login');
}