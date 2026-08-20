const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teamName: { type: String, required: true, default: 'My Team' },
  points: { type: Number, default: 0 },
  gwHistory: [{
    gameweek: Number,
    points: Number
  }],
  
  // Budget tracking
  budget: { type: Number, default: 100.0 },
  
  // The Squad (15 Players)
  squad: [{
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    isBench: { type: Boolean, default: false },
    isCaptain: { type: Boolean, default: false },
    isViceCaptain: { type: Boolean, default: false }
  }],

  // Chips History (true = used)
  chips: {
    tc: { type: Boolean, default: false }, // Triple Captain
    bb: { type: Boolean, default: false }, // Bench Boost
    fh: { type: Boolean, default: false }, // Free Hit
    wc: { type: Boolean, default: false }  // Wildcard
  },

  // Current Gameweek State
  activeChip: { type: String, default: null }, // 'tc', 'bb', etc. for current week

  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

module.exports = mongoose.model('User', UserSchema);