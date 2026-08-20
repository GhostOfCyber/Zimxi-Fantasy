require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Player = require('../models/Player');
const Fixture = require('../models/Fixture');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('DB Connected for Seeding');

  // Clear DB
  await User.deleteMany({});
  await Player.deleteMany({});
  await Fixture.deleteMany({});

  // 1. Create Admin
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('Password123!', salt);
  await User.create({
    name: 'Admin User',
    email: 'admin@betterbrands.test',
    password: hash,
    role: 'admin'
  });
  console.log('Admin created: admin@betterbrands.test / Password123!');

  // 2. Create Players
  const playersData = [
    { name: 'Khama Billiat', position: 'FWD', team: 'Yadah', price: 12.0 },
    { name: 'Frank Makarati', position: 'DEF', team: 'Dynamos', price: 6.5 },
    { name: 'Ariel Sibanda', position: 'GK', team: 'Highlanders', price: 5.5 },
    { name: 'Walter Musona', position: 'MID', team: 'Simba Bhora', price: 9.0 },
    { name: 'Peter Muduhwa', position: 'DEF', team: 'Highlanders', price: 6.0 },
    { name: 'Donald Mudadi', position: 'MID', team: 'Dynamos', price: 7.0 },
  ];
  const players = await Player.insertMany(playersData);
  console.log('Players created');

  // 3. Create Fixture
  await Fixture.create({
    gameweek: 1,
    homeTeam: 'Dynamos',
    awayTeam: 'Highlanders',
    played: false
  });
  console.log('Fixture created');

  mongoose.disconnect();
};

seed();