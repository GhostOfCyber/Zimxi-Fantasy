const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  team: { type: String, required: true },
  price: { type: Number, required: true },
  totalPoints: { type: Number, default: 0 },
  
  // NEW: History of points per gameweek
  history: [{
    gameweek: Number,
    points: Number,
    stats: {
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      cleanSheet: { type: Boolean, default: false },
      yellowCards: { type: Number, default: 0 },
      redCards: { type: Number, default: 0 },
      minutesPlayed: { type: Number, default: 0 }
    }
  }]
});

module.exports = mongoose.model('Player', PlayerSchema);