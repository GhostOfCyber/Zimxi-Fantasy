const mongoose = require('mongoose');

const squadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameweek: { type: Number, required: true },
  
  // The 11 starters
  starters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  
  // The bench (optional for MVP, but good practice)
  bench: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  
  captain: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  viceCaptain: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  
  // Points earned by this specific squad snapshot
  totalPoints: { type: Number, default: 0 },
  isProcessed: { type: Boolean, default: false }
});

// Ensure a user only has one squad entry per gameweek
squadSchema.index({ user: 1, gameweek: 1 }, { unique: true });

module.exports = mongoose.model('Squad', squadSchema);