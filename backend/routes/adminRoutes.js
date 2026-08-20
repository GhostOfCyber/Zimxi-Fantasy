const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Player = require('../models/Player');
const Fixture = require('../models/Fixture');

// Middleware to check admin role
const adminCheck = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  next();
};

// Upload Players
router.post('/upload', [auth, adminCheck], async (req, res) => {
  try {
    const { players } = req.body;
    await Player.deleteMany({}); // Clear existing
    await Player.insertMany(players);
    res.json({ msg: 'Players uploaded' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create Fixture
router.post('/fixtures', [auth, adminCheck], async (req, res) => {
  try {
    const fixture = new Fixture(req.body);
    await fixture.save();
    res.json(fixture);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Compute Points (Placeholder)
router.post('/compute-points', [auth, adminCheck], async (req, res) => {
    // Logic for computing points would go here
    res.json({ msg: 'Points computation triggered (Logic Pending)', playerPointsMap: {} });
});

const User = require('../models/User');

// @route   POST api/admin/update-points
router.post('/update-points', [auth, adminCheck], async (req, res) => {
  const { gameweek, matchStats } = req.body;

  console.log(`Processing GW ${gameweek} for ${matchStats.length} players...`);

  try {
    const playerPointsMap = {}; 

    // 1. UPDATE PLAYERS
    for (const stat of matchStats) {
      const player = await Player.findById(stat.playerId);
      
      if (!player) {
          console.log(`Skipping unknown player ID: ${stat.playerId}`);
          continue;
      }

      // --- FIX 1: Initialize history if it's missing (The 500 Error Fix) ---
      if (!player.history) {
          player.history = [];
      }

      // --- FIX 2: Ensure all stats are numbers (Prevent Math Crashes) ---
      const goals = parseInt(stat.goals) || 0;
      const assists = parseInt(stat.assists) || 0;
      const mins = parseInt(stat.minutesPlayed) || 0;
      const yel = parseInt(stat.yellowCards) || 0;
      const red = parseInt(stat.redCards) || 0;
      const clean = stat.cleanSheet === true || stat.cleanSheet === 'true';

      let pts = 0;
      
      // Minutes
      if (mins >= 60) pts += 2;
      else if (mins > 0) pts += 1;

      // Goals
      if (player.position === 'FWD') pts += (goals * 4);
      else if (player.position === 'MID') pts += (goals * 5);
      else pts += (goals * 6);

      // Assists
      pts += (assists * 3);

      // Clean Sheet
      if (clean && (player.position === 'GK' || player.position === 'DEF')) {
        pts += 4;
      }

      // Cards
      pts -= (yel * 1);
      pts -= (red * 3);

      // Add to History
      player.history.push({
        gameweek: gameweek,
        points: pts,
        stats: { 
            goals, assists, cleanSheet: clean, 
            yellowCards: yel, redCards: red, minutesPlayed: mins 
        }
      });
      
      // Update Total
      player.totalPoints = (player.totalPoints || 0) + pts;
      
      await player.save();
      playerPointsMap[player._id.toString()] = pts;
    }

    // 2. UPDATE USERS
    const users = await User.find({ role: 'user' });
    console.log(`Updating points for ${users.length} users...`);

    for (const user of users) {
      let gwPoints = 0;

      if (!user.squad) continue; // Skip if user has no squad

      user.squad.forEach(item => {
        // Safety check if player was deleted from DB but is still in user squad
        if (!item.player) return; 

        // Skip bench (unless Bench Boost)
        if (item.isBench && user.activeChip !== 'bb') return;

        const pId = item.player.toString();
        if (playerPointsMap[pId]) {
          let pPoints = playerPointsMap[pId];

          if (item.isCaptain) {
            pPoints *= (user.activeChip === 'tc' ? 3 : 2);
          }
          gwPoints += pPoints;
        }
      });

      // Initialize gwHistory if missing
      if (!user.gwHistory) user.gwHistory = [];

      user.gwHistory.push({ gameweek, points: gwPoints });
      user.points = (user.points || 0) + gwPoints;
      user.activeChip = null; 
      
      await user.save();
    }

    console.log("Success!");
    res.json({ msg: `Gameweek ${gameweek} updated successfully!` });

  } catch (err) {
    console.error("CRITICAL ERROR:", err); // <--- Check your terminal for this log!
    res.status(500).send('Server Error: ' + err.message);
  }
});

module.exports = router;