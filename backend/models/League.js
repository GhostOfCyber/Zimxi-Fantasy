const mongoose = require('mongoose');

const LeagueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // The secret code to join
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who created it
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('League', LeagueSchema);