const { Router } = require('express');
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const router = Router();

if (authController.login_post && authController.signup_post) {
    router.post('/login', authController.login_post);
    router.post('/signup', authController.signup_post);
    router.patch('/profile', requireAuth, authController.updateProfile);
} else {
    console.error("Auth controller methods are undefined!");
}

module.exports = router;