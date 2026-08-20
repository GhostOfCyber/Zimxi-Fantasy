const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Dynamos"
  shortName: { type: String, required: true }, // e.g. "DYN"
  logoUrl: { type: String, default: '' },
  
  // Real League Stats (for the League Table page)
  played: { type: Number, default: 0 },
  won: { type: Number, default: 0 },
  drawn: { type: Number, default: 0 },
  lost: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  points: { type: Number, default: 0 }
});

module.exports = mongoose.model('Team', teamSchema);