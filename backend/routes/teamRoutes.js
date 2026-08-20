const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const teamController = require('../controllers/teamController');

// Save Transfers (15 players, budget check)
router.post('/transfer', auth, teamController.saveTransfers);

// Save Lineup (Starters vs Bench, Captains, Chips)
router.post('/lineup', auth, teamController.saveLineup);

// Get My Team (Populated)
router.get('/', auth, teamController.getTeam);

module.exports = router;