const User = require('../models/User');
const Player = require('../models/Player');

// 1. SAVE TRANSFERS (Buying/Selling)
exports.saveTransfers = async (req, res) => {
  const { squadIds } = req.body;
  
  if (!squadIds || squadIds.length !== 15) {
    return res.status(400).json({ msg: 'Squad must have exactly 15 players' });
  }

  try {
    // Fetch all players to check prices and positions
    const players = await Player.find({ '_id': { $in: squadIds } });

    if (players.length !== 15) {
      return res.status(400).json({ msg: 'Invalid player IDs provided' });
    }

    // Validate Budget
    const totalCost = players.reduce((sum, p) => sum + p.price, 0);
    if (totalCost > 100.0) {
      return res.status(400).json({ msg: `Budget exceeded! Cost: ${totalCost.toFixed(1)}m` });
    }

    // Validate Positions limits
    const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    players.forEach(p => counts[p.position]++);
    
    if (counts.GK !== 2 || counts.DEF !== 5 || counts.MID !== 5 || counts.FWD !== 3) {
      return res.status(400).json({ msg: 'Invalid formation. Need 2 GK, 5 DEF, 5 MID, 3 FWD.' });
    }

    // Logic to set default lineup (First GK starts, First 4 DEF, 4 MID, 2 FWD start)
    // This is a simple auto-picker so the user has a valid lineup immediately after transfer
    let posCounter = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    
    const formattedSquad = players.map(p => {
      posCounter[p.position]++;
      // Bench Logic: 2nd GK, 5th DEF, 5th MID, 3rd FWD go to bench
      let isBench = false;
      if (p.position === 'GK' && posCounter.GK > 1) isBench = true;
      if (p.position === 'DEF' && posCounter.DEF > 4) isBench = true;
      if (p.position === 'MID' && posCounter.MID > 4) isBench = true;
      if (p.position === 'FWD' && posCounter.FWD > 2) isBench = true;

      return {
        player: p._id,
        isBench: isBench,
        isCaptain: false, // Reset captain
        isViceCaptain: false
      };
    });

    // Save to User
    const user = await User.findById(req.user.id);
    user.squad = formattedSquad;
    user.budget = 100.0 - totalCost; // Update remaining budget
    await user.save();

    res.json({ msg: 'Transfers saved successfully', squad: user.squad, budget: user.budget });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// 2. SAVE LINEUP (My Team: Bench, Captains, Chips)
exports.saveLineup = async (req, res) => {
  // Expects: { squad: [{ playerId, isBench, isCaptain }], activeChip: 'tc' | null }
  const { squadUpdates, activeChip } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // 1. Handle Chips
    if (activeChip) {
      // Check if valid chip name
      if (!['tc', 'bb', 'fh', 'wc'].includes(activeChip)) {
        return res.status(400).json({ msg: 'Invalid chip name' });
      }
      // Check if already used
      if (user.chips[activeChip]) {
        return res.status(400).json({ msg: `${activeChip.toUpperCase()} has already been used this season.` });
      }
      
      user.activeChip = activeChip;
      // Note: We usually mark it as 'used' (true) ONLY after the deadline passes.
      // For simplicity in this MVP, we mark it used immediately or rely on points engine.
      // Let's mark it as pending in activeChip.
    } else {
        user.activeChip = null; // Cancel chip if none sent
    }

    // 2. Update Squad Status
    // We iterate through the existing squad and update flags based on request
    squadUpdates.forEach(update => {
      const playerIndex = user.squad.findIndex(s => s.player.toString() === update.playerId);
      if (playerIndex > -1) {
        user.squad[playerIndex].isBench = update.isBench;
        user.squad[playerIndex].isCaptain = update.isCaptain;
        user.squad[playerIndex].isViceCaptain = update.isViceCaptain;
      }
    });

    // Optional: Validate that exactly 11 players are !isBench (unless Bench Boost active)
    const starters = user.squad.filter(s => !s.isBench).length;
    if (starters !== 11 && user.activeChip !== 'bb') {
       return res.status(400).json({ msg: 'Must have exactly 11 starting players.' });
    }
    
    // Validate Captain count
    const captains = user.squad.filter(s => s.isCaptain).length;
    if (captains !== 1) {
        return res.status(400).json({ msg: 'Must select exactly one captain.' });
    }

    await user.save();
    res.json({ msg: 'Team lineup updated', activeChip: user.activeChip });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// 3. GET TEAM (Fetch populated squad)
exports.getTeam = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('squad.player');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      squad: user.squad,
      budget: user.budget,
      chips: user.chips,
      activeChip: user.activeChip,
      teamName: user.teamName
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};