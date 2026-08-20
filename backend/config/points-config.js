module.exports = {
  // Appearance points
  MINUTES: {
    PLAYED: 1,      // Played 1-59 minutes
    FULL_MATCH: 2   // Played 60+ minutes
  },

  // Goals scored (based on player position)
  GOAL: {
    GK: 6,
    DEF: 6,
    MID: 5,
    FWD: 4
  },

  ASSIST: 3,

  // Clean sheets (only applies if played 60+ mins)
  CLEAN_SHEET: {
    GK: 4,
    DEF: 4,
    MID: 1,  // Optional: Some leagues give MIDs 1 point
    FWD: 0
  },

  // Disciplinary
  CARDS: {
    YELLOW: -1,
    RED: -3
  },

  // Goalkeeper specific
  SAVES: {
    UNIT: 3,   // Number of saves required...
    POINTS: 1  // ...to earn this many points (e.g., 1 pt for every 3 saves)
  },
  
  // Bonus points (optional usage)
  BONUS: {
    MAX: 3
  }
};