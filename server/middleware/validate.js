const { validationResult } = require('express-validator');
module.exports = (req, res, next) => {
  const e = validationResult(req);
  if (!e.isEmpty()) return res.status(400).json({ message: 'Invalid input', errors: e.array().map((x) => x.msg) });
  next();
};
