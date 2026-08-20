const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// --- ROUTE DEFINITIONS ---
// 1. Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// 2. Admin Routes
app.use('/api/admin', require('./routes/adminRoutes'));

// 3. Public Routes (Players, Fixtures, Leaderboard)
app.use('/api/public', require('./routes/publicRoutes')); // or playerRoutes/fixtureRoutes depending on your file name

// 4. NEW: Team Routes (Transfers, Lineups) <--- ADD THIS SECTION
app.use('/api/team', require('./routes/teamRoutes'));

//5. League routes
app.use('/api/leagues', require('./routes/leagueRoutes'));
// -------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));