const Fixture = require('../models/Fixture');

// Get all fixtures, optionally filtered by Gameweek
exports.getFixtures = async (req, res) => {
  try {
    const { gw } = req.query;
    let query = {};
    
    if (gw) {
      query.gameweek = gw;
    }

    const fixtures = await Fixture.find(query).sort({ gameweek: 1, date: 1 });
    res.json(fixtures);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Get Grouped Fixtures (For Carousel: Returns { 34: [matches], 35: [matches] })
exports.getFixturesGrouped = async (req, res) => {
    try {
        const fixtures = await Fixture.find().sort({ gameweek: 1 });
        
        const grouped = fixtures.reduce((acc, match) => {
            const gw = match.gameweek;
            if (!acc[gw]) acc[gw] = [];
            acc[gw].push(match);
            return acc;
        }, {});

        // Convert to array for easier frontend mapping
        // [{ gw: 1, matches: [] }, { gw: 2, matches: [] }]
        const result = Object.keys(grouped).map(gw => ({
            gw: parseInt(gw),
            matches: grouped[gw]
        }));

        res.json(result);
    } catch (err) {
        res.status(500).send('Server Error');
    }
}