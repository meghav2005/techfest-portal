require('dotenv').config();
const mongoose = require('mongoose');
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error('Set MONGO_URI and JWT_SECRET in server/.env');
  process.exit(1);
}
const app = require('./app');
const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`API running on port ${port}`)))
  .catch((e) => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
