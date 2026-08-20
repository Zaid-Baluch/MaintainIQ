const express = require('express');
const router = express.Router();
const { register, login, refresh, logout, me, updateMe } = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validations/auth.validation');
const validateRequest = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const mongoose = require('mongoose');

router.get('/db-debug', (req, res) => {
  const uri = process.env.MONGO_URI || '';
  const censoredUri = uri.replace(/:([^@]+)@/, ':*****@');
  res.json({
    readyState: mongoose.connection.readyState,
    mongoUri: censoredUri,
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    hasMongoUri: !!process.env.MONGO_URI
  });
});

router.post('/register', authLimiter, registerValidator, validateRequest, register);
router.post('/login', authLimiter, loginValidator, validateRequest, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, me);
router.put('/me', protect, updateMe);

module.exports = router;
