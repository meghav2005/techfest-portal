const router = require('express').Router();
const { body, param } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find().sort('date').lean();
    const counts = await Registration.aggregate([{ $group: { _id: '$event', n: { $sum: 1 } } }]);
    const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
    res.json(events.map((e) => ({ ...e, registered: map[String(e._id)] || 0 })));
  } catch (e) { next(e); }
});

router.get('/mine', protect, async (req, res, next) => {
  try {
    res.json(await Registration.find({ user: req.user._id }).populate('event').sort('-createdAt'));
  } catch (e) { next(e); }
});

router.post('/', protect, adminOnly,
  body('title').isString().trim().notEmpty(),
  body('category').isString().trim().notEmpty(),
  body('date').isISO8601(),
  body('capacity').optional().isInt({ min: 1 }),
  validate,
  async (req, res, next) => {
    try {
      const { title, category, description, date, venue, capacity } = req.body;
      res.status(201).json(await Event.create({ title, category, description, date, venue, capacity }));
    } catch (e) { next(e); }
  });

router.post('/:id/register', protect, param('id').isMongoId(), validate, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if ((await Registration.countDocuments({ event: event._id })) >= event.capacity)
      return res.status(409).json({ message: 'Event is full' });
    await Registration.create({ user: req.user._id, event: event._id });
    res.status(201).json({ message: 'Registered for ' + event.title });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'You are already registered' });
    next(e);
  }
});
module.exports = router;
