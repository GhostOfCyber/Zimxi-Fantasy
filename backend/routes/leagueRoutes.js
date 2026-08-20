const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const leagueController = require('../controllers/leagueController');

router.post('/create', auth, leagueController.createLeague);
router.post('/join', auth, leagueController.joinLeague);
router.get('/my-leagues', auth, leagueController.getMyLeagues);
router.get('/:id', auth, leagueController.getLeagueDetails);

module.exports = router;