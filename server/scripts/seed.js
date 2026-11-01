require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Event = require('../models/Event');
const User = require('../models/User');
const DemoUser = require('../models/DemoUser');
const ev = (title, category, d, venue, capacity, description) => ({ title, category, date: new Date(d), venue, capacity, description });
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Event.deleteMany({});
  await Event.insertMany([
    ev('HackStorm 24h', 'Coding', '2026-12-10T09:00:00', 'Main Lab Block', 120, 'A 24-hour hackathon. Teams of up to four build a working product.'),
    ev('Robo Race', 'Robotics', '2026-12-10T11:00:00', 'Quadrangle', 40, 'Build a line-follower and race it on a timed track.'),
    ev('CodeSprint', 'Coding', '2026-12-11T10:00:00', 'Lab 3', 80, 'Solve algorithm problems against the clock.'),
    ev('UI Duel', 'Design', '2026-12-11T13:00:00', 'Seminar Hall', 60, 'Redesign a real app screen in 90 minutes.'),
    ev('Quiz Arena', 'Quiz', '2026-12-11T15:30:00', 'Auditorium', 200, 'Tech, science and pop culture rounds.'),
    ev('Cloud Clinic', 'Workshop', '2026-12-12T10:00:00', 'Lab 1', 50, 'Deploy a MERN app to the cloud, step by step.'),
    ev('Gaming Night', 'Esports', '2026-12-12T18:00:00', 'Student Centre', 64, 'Knockout tournament on shared consoles.'),
    ev('Demo Day', 'Showcase', '2026-12-13T14:00:00', 'Auditorium', 300, 'Finalists present to the judges and visitors.'),
  ]);
  await User.deleteOne({ email: 'admin@techfest.dev' });
  await User.create({ name: 'Admin', email: 'admin@techfest.dev', role: 'admin', password: await bcrypt.hash('Admin@1234', 12) });
  await DemoUser.deleteMany({});
  await DemoUser.create({ email: 'demo@techfest.dev', password: 'demo123' });
  console.log('Seeded 8 events, admin@techfest.dev / Admin@1234, and the injection-demo user');
  process.exit(0);
})();
