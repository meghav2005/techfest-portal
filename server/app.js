const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const secure = (process.env.SECURITY_MODE || 'secure') !== 'vulnerable';
const app = express();
app.set('trust proxy', 1);

if (secure) app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); // security headers
app.use(compression());
app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(','), credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
if (secure) app.use(mongoSanitize()); // strips $ and . keys -> stops NoSQL injection

// CSRF defence: state-changing calls must carry a custom header. A forged form on another
// site cannot set it, and cross-origin fetch with it is blocked by CORS. Works with SameSite cookies.
app.use((req, res, next) => {
  const unsafe = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  if (secure && unsafe && req.get('X-Requested-With') !== 'XMLHttpRequest')
    return res.status(403).json({ message: 'CSRF check failed' });
  next();
});

app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', mode: secure ? 'secure' : 'vulnerable' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/feedback', require('./routes/feedback'));
if (process.env.ENABLE_DEMO === 'true') app.use('/api/demo', require('./routes/demo'));

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' }); // no stack traces leaked
});
module.exports = app;
