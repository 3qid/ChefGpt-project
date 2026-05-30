const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = async (req, res, next) => {
  // 1. Verify user is authenticated
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  // 2. Extract the token from the "Bearer <token>" string
  const token = authorization.split(' ')[1]

  try {
    // 3. Verify the token signature using the secret key
    const { _id } = jwt.verify(token, process.env.SECRET)

    // 4. Find the user in DB and only return the _id property (slims down the request payload)
    req.user = await User.findOne({ _id }).select('_id')
    
    // 5. Move on to the next middleware/controller function
    next()

  }  catch (error) {
    console.log("❌ [requireAuth] فشل الفحص! المفتاح السري الذي نستخدمه للفحص حالياً هو:", process.env.SECRET);
    console.log("📋 [requireAuth] نص الخطأ القادم من مكتبة JWT هو:", error.message);
    res.status(401).json({ error: 'Request is not authorized' })
  }
}
module.exports = requireAuth 