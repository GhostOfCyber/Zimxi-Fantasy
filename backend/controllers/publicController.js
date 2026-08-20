const Player = require('../models/Player');
const Fixture = require('../models/Fixture');
const User = require('../models/User');

exports.getPlayers = async (req, res) => {
  const players = await Player.find({});
  res.json(players);
};

exports.getFixtures = async (req, res) => {
  const fixtures = await Fixture.find({});
  res.json(fixtures);
};

exports.getLeaderboard = async (req, res) => {
  const users = await User.find({ role: 'user' })
    .sort({ points: -1 })
    .select('name teamName points')
    .limit(50);
  res.json(users);
};

exports.saveTeam = async (req, res) => {
    // Basic squad saving
    try {
        const user = await User.findById(req.user.id);
        const { squadIds } = req.body; // Array of player IDs
        
        // Basic validation: Check budget (omitted for brevity) and count (11 players)
        if(squadIds.length > 15) return res.status(400).json({msg: "Too many players"});

        user.squad = squadIds;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send("Error saving team");
    }
}