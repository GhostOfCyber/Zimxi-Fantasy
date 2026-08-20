module.exports = {
  MINUTES: {
    PLAYED: 1,      // 1-59 minutes
    FULL_MATCH: 2   // 60+ minutes
  },
  GOAL: {
    GK: 6,
    DEF: 6,
    MID: 5,
    FWD: 4
  },
  ASSIST: 3,
  CLEAN_SHEET: {
    GK: 4,
    DEF: 4,
    MID: 1, // Sometimes mids get 1 point for CS in some leagues
    FWD: 0
  },
  CARDS: {
    YELLOW: -1,
    RED: -3
  },
  SAVES: {
    UNIT: 3,   // Every 3 saves...
    POINTS: 1  // ...gets 1 point
  }
};