const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const prod = process.env.NODE_ENV === 'production';
// httpOnly: JS cannot read it (XSS). secure: HTTPS only. sameSite: limits cross-site sending (CSRF).
// Frontend and API are on different domains in production, so SameSite must be 'none' there (needs secure).
const cookieOpts = { httpOnly: true, secure: prod, sameSite: prod ? 'none' : 'lax', maxAge: 7 * 24 * 3600 * 1000 };
const sign = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, cookieOpts);
};
const pub = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

router.post('/register',
  body('name').isString().trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
  body('email').isString().isEmail().normalizeEmail().withMessage('Enter a valid email'),
  body('password').isString().isLength({ min: 8, max: 72 }).withMessage('Password must be 8-72 characters'),
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered' });
      const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
      sign(res, user);
      res.status(201).json({ user: pub(user) });
    } catch (e) { next(e); }
  });

router.post('/login',
  body('email').isString().isEmail().normalizeEmail().withMessage('Enter a valid email'),
  body('password').isString().notEmpty().withMessage('Password required'),
  validate,
  async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user || !(await bcrypt.compare(req.body.password, user.password)))
        return res.status(401).json({ message: 'Wrong email or password' });
      sign(res, user);
      res.json({ user: pub(user) });
    } catch (e) { next(e); }
  });

router.post('/logout', (req, res) => {
  res.clearCookie('token', { ...cookieOpts, maxAge: undefined });
  res.json({ message: 'Logged out' });
});
router.get('/me', protect, (req, res) => res.json({ user: pub(req.user) }));
module.exports = router;
