const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Fixture = require('../models/Fixture');
const User = require('../models/User');

// Get All Players
router.get('/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get Fixtures
router.get('/fixtures', async (req, res) => {
  try {
    const fixtures = await Fixture.find().sort({ date: 1 });
    res.json(fixtures);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get Fixtures Grouped (For Carousel)
router.get('/fixtures-grouped', async (req, res) => {
    try {
        const fixtures = await Fixture.find().sort({ gameweek: 1 });
        const grouped = fixtures.reduce((acc, match) => {
            const gw = match.gameweek;
            if (!acc[gw]) acc[gw] = [];
            acc[gw].push(match);
            return acc;
        }, {});
        
        // Convert to array format
        const result = Object.keys(grouped).map(gw => ({
            gw: parseInt(gw),
            matches: grouped[gw]
        }));
        res.json(result);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .sort({ points: -1 })
      .select('name teamName points')
      .limit(50);
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
