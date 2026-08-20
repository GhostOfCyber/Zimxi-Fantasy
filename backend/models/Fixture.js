const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
  gameweek: { type: Number, required: true },
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  played: { type: Boolean, default: false },
  result: {
    homeScore: { type: Number, default: 0 },
    awayScore: { type: Number, default: 0 }
  },
  // Stats used to calculate points
  stats: [{
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    minutesPlayed: Number,
    goals: Number,
    assists: Number,
    yellowCards: Number,
    redCards: Number,
    saves: Number,
    cleanSheet: Boolean
  }]
});

module.exports = mongoose.model('Fixture', fixtureSchema);