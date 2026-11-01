// DELIBERATELY INSECURE - lab NoSQL-injection demo only (ENABLE_DEMO=true).
// Body {"email":{"$gt":""},"password":{"$gt":""}} logs in without credentials when mongoSanitize is OFF.
const router = require('express').Router();
const DemoUser = require('../models/DemoUser');
router.post('/login', async (req, res, next) => {
  try {
    const u = await DemoUser.findOne({ email: req.body.email, password: req.body.password });
    if (!u) return res.status(401).json({ message: 'Login failed' });
    res.json({ message: 'LOGIN SUCCESS as ' + u.email });
  } catch (e) { next(e); }
});
module.exports = router;
