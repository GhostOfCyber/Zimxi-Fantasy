const League = require('../models/League');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Create a League
exports.createLeague = async (req, res) => {
  const { name } = req.body;
  try {
    // Generate a simple 6-character code (e.g., "AB12CD")
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const league = new League({
      name,
      code,
      admin: req.user.id,
      members: [req.user.id] // Creator joins automatically
    });

    await league.save();
    res.json(league);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Join a League
exports.joinLeague = async (req, res) => {
  const { code } = req.body;
  try {
    const league = await League.findOne({ code });
    if (!league) return res.status(404).json({ msg: 'League not found' });

    // Check if already a member
    if (league.members.includes(req.user.id)) {
      return res.status(400).json({ msg: 'You are already in this league' });
    }

    league.members.push(req.user.id);
    await league.save();

    res.json(league);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get User's Leagues
exports.getMyLeagues = async (req, res) => {
  try {
    // Find all leagues where user is a member
    const leagues = await League.find({ members: req.user.id });
    res.json(leagues);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get League Leaderboard (with Members populated)
exports.getLeagueDetails = async (req, res) => {
  try {
    const league = await League.findById(req.params.id)
      .populate({
        path: 'members',
        select: 'name teamName points gwHistory' // Fetch needed stats
      });
    
    if (!league) return res.status(404).json({ msg: 'League not found' });

    // Sort members by total points (High to Low)
    league.members.sort((a, b) => b.points - a.points);

    res.json(league);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};