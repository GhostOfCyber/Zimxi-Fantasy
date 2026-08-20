const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Debugging: Check if imports are valid functions
if (typeof authController.register !== 'function') console.log("CRITICAL ERROR: authController.register is not a function");
if (typeof authController.login !== 'function') console.log("CRITICAL ERROR: authController.login is not a function");
if (typeof authController.getMe !== 'function') console.log("CRITICAL ERROR: authController.getMe is not a function");
if (typeof authMiddleware !== 'function') console.log("CRITICAL ERROR: authMiddleware is not a function", authMiddleware);

// @route   POST api/auth/register
router.post('/register', authController.register);

// @route   POST api/auth/login
router.post('/login', authController.login);

// @route   GET api/auth/me
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;