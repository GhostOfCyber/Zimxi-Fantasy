const POINTS = require('../config/points-config');

const calculatePlayerPoints = (position, stats) => {
  let score = 0;

  // 1. Minutes Played
  if (stats.minutesPlayed >= 60) score += POINTS.MINUTES.FULL_MATCH;
  else if (stats.minutesPlayed > 0) score += POINTS.MINUTES.PLAYED;

  // 2. Goals (Position dependent)
  if (stats.goals > 0) {
    const goalPoints = POINTS.GOAL[position] || 4; // Default to 4 if pos undefined
    score += (stats.goals * goalPoints);
  }

  // 3. Assists
  if (stats.assists > 0) {
    score += (stats.assists * POINTS.ASSIST);
  }

  // 4. Clean Sheet (Position dependent, min 60 mins required)
  if (stats.cleanSheet && stats.minutesPlayed >= 60) {
    const csPoints = POINTS.CLEAN_SHEET[position] || 0;
    score += csPoints;
  }

  // 5. Cards
  if (stats.yellowCards > 0) score += (stats.yellowCards * POINTS.CARDS.YELLOW);
  if (stats.redCards > 0) score += POINTS.CARDS.RED;

  // 6. Saves (GK only)
  if (position === 'GK' && stats.saves > 0) {
    const savePoints = Math.floor(stats.saves / POINTS.SAVES.UNIT) * POINTS.SAVES.POINTS;
    score += savePoints;
  }

  return score;
};

module.exports = { calculatePlayerPoints };