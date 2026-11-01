const router = require('express').Router();
const { body } = require('express-validator');
const Feedback = require('../models/Feedback');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    res.json(await Feedback.find().sort('-createdAt').limit(20).populate('user', 'name'));
  } catch (e) { next(e); }
});
// Stored as typed; React renders it as plain text (escaped), so markup never runs.
router.post('/', protect,
  body('message').isString().trim().isLength({ min: 1, max: 500 }).withMessage('Message must be 1-500 characters'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  validate,
  async (req, res, next) => {
    try {
      res.status(201).json(await Feedback.create({ user: req.user._id, message: req.body.message, rating: req.body.rating }));
    } catch (e) { next(e); }
  });
module.exports = router;
