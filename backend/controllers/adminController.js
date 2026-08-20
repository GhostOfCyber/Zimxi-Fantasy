const Player = require('../models/Player');
const Fixture = require('../models/Fixture');
const User = require('../models/User');
const { calculatePlayerPoints } = require('../services/pointsEngine');

exports.uploadData = async (req, res) => {
  // Simplified for demo: Expecting JSON payload with { players: [] }
  // In a full implementation with 'multer', we would parse req.file buffer.
  try {
    const { players } = req.body; 
    if (!players || !Array.isArray(players)) return res.status(400).json({ msg: 'Invalid data format' });

    // Bulk upsert players
    for (const p of players) {
      await Player.findOneAndUpdate(
        { name: p.name, team: p.team },
        p,
        { upsert: true, new: true }
      );
    }
    res.json({ msg: 'Players data updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.createFixture = async (req, res) => {
  try {
    const fixture = new Fixture(req.body);
    await fixture.save();
    res.json(fixture);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.computePoints = async (req, res) => {
  try {
    const { fixtureId } = req.body;
    const fixture = await Fixture.findById(fixtureId).populate('stats.playerId');
    
    if (!fixture || !fixture.played) return res.status(400).json({ msg: 'Fixture not found or not played' });

    // 1. Calculate points for each player in the fixture
    const playerPointsMap = {}; // { playerId: points }
    
    for (const stat of fixture.stats) {
      if(!stat.playerId) continue;
      const points = calculatePlayerPoints(stat.playerId.position, stat);
      playerPointsMap[stat.playerId._id.toString()] = points;
      
      // Update Player total points
      stat.playerId.totalPoints += points;
      await stat.playerId.save();
    }

    // 2. Update Users who have these players
    const users = await User.find({});
    for (const user of users) {
      let gwPoints = 0;
      for (const player of user.squad) {
        if (playerPointsMap[player.toString()]) {
          gwPoints += playerPointsMap[player.toString()];
        }
      }
      user.points += gwPoints;
      await user.save();
    }

    res.json({ msg: 'Points computation complete', playerPointsMap });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getStats = async (req, res) => {
  const userCount = await User.countDocuments();
  const playerCount = await Player.countDocuments();
  res.json({ userCount, playerCount });
};