const { calculatePlayerPoints } = require('../services/pointsEngine');

test('Striker scores a goal: 4 points', () => {
  const stats = { minutesPlayed: 90, goals: 1, assists: 0, yellowCards: 0, redCards: 0 };
  expect(calculatePlayerPoints('FWD', stats)).toBe(6); // 2 (mins) + 4 (goal)
});

test('Defender scores and keeps clean sheet: 12 points', () => {
    // 2 (mins) + 6 (goal) + 4 (CS) = 12
  const stats = { minutesPlayed: 90, goals: 1, assists: 0, cleanSheet: true, yellowCards: 0, redCards: 0 };
  expect(calculatePlayerPoints('DEF', stats)).toBe(12);
});

test('GK saves 6 shots: 2 points', () => {
  // 2 (mins) + 2 (6/3 saves) = 4
  const stats = { minutesPlayed: 90, saves: 6, goals: 0, assists: 0, cleanSheet: false, yellowCards: 0, redCards: 0 };
  expect(calculatePlayerPoints('GK', stats)).toBe(4);
});