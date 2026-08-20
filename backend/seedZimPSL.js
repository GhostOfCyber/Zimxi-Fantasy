require('dotenv').config();
const mongoose = require('mongoose');
const Player = require('./models/Player');
const Team = require('./models/Team');
const Squad = require('./models/Squad');

const firstNames = [
    "Tinashe", "Kudzai", "Tafadzwa", "Knowledge", "Khama", "Marvelous", "Tendai", 
    "Willard", "Washington", "Tatenda", "Ronald", "Evans", "Cuthbert", "Ovidy", 
    "Peter", "Bruce", "Hardlife", "Devine", "Blessing", "Mkhokheli", "Innocent",
    "Thabani", "Nqobizitha", "Obriel", "Walter", "Frank", "Ariel", "William",
    "Godknows", "Never", "Prince", "Denver", "Rodwell", "Partson", "Ocean",
    "Gideon", "Tawanda", "Ralph", "Lincoln", "Bhekimpilo", "Mthokozisi", "Sipho"
];

const lastNames = [
    "Musona", "Billiat", "Nakamba", "Katsande", "Mutizwa", "Ndoro", "Karuru",
    "Mahachi", "Chipezeze", "Darikwa", "Mudimu", "Dube", "Ndlovu", "Moyo", 
    "Sibanda", "Ncube", "Mutasa", "Chinyama", "Phiri", "Nyoni", "Nkomo",
    "Makarati", "Chirinda", "Manondo", "Tigere", "Zekumbawire", "Murwira",
    "Bhasera", "Zvasiya", "Gutu", "Mukamba", "Mupasiri", "Kamusoko", "Madhanaga",
    "Mucheneka", "Maringwa", "Benyu", "Pfumbidzai", "Hadebe", "Lunga", "Munetsi"
];

const teamsData = [
    { name: "Dynamos FC", short: "DYN" },
    { name: "Highlanders FC", short: "BOSSO" },
    { name: "CAPS United", short: "CAPS" },
    { name: "FC Platinum", short: "FCP" },
    { name: "Ngezi Platinum Stars", short: "NPS" },
    { name: "Chicken Inn", short: "CHICK" },
    { name: "Manica Diamonds", short: "MAN" },
    { name: "Simba Bhora", short: "SIMBA" },
    { name: "Yadah FC", short: "YAD" },
    { name: "ZPC Kariba", short: "ZPC" },
    { name: "Herentals", short: "HER" },
    { name: "Bulawayo Chiefs", short: "CHIEFS" },
    { name: "Green Fuel", short: "GREEN" },
    { name: "Hwange", short: "HWN" },
    { name: "TelOne", short: "TEL" },
    { name: "Chegutu Pirates", short: "PIR" },
    { name: "Arenel Movers", short: "ARENEL" },
    { name: "Bikita Minerals", short: "BIKITA" }
];

// Specific star players to guarantee in the DB
const starPlayers = [
    { name: "Khama Billiat", position: "MID", team: "Yadah FC", price: 12.0 },
    { name: "Walter Musona", position: "FWD", team: "Simba Bhora", price: 11.0 },
    { name: "Obriel Chirinda", position: "FWD", team: "Ngezi Platinum Stars", price: 10.5 },
    { name: "Frank Makarati", position: "DEF", team: "Dynamos FC", price: 7.0 },
    { name: "Ariel Sibanda", position: "GK", team: "Highlanders FC", price: 6.5 },
    { name: "William Manondo", position: "FWD", team: "CAPS United", price: 10.0 },
    { name: "Brian Banda", position: "MID", team: "FC Platinum", price: 8.5 },
    { name: "Donovan Bernard", position: "GK", team: "Chicken Inn", price: 6.0 },
    { name: "Tino Kadewere", position: "FWD", team: "Dynamos FC", price: 11.5 }, // Hypothetical return
    { name: "Denver Mukamba", position: "MID", team: "Dynamos FC", price: 8.0 }
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomPlayer(teamName, position) {
    const fName = getRandomItem(firstNames);
    const lName = getRandomItem(lastNames);
    
    let priceBase;
    if (position === 'GK') priceBase = 4.0 + Math.random() * 2.0;
    else if (position === 'DEF') priceBase = 4.5 + Math.random() * 2.5;
    else if (position === 'MID') priceBase = 5.0 + Math.random() * 3.5;
    else priceBase = 5.5 + Math.random() * 4.0;

    return {
        name: `${fName} ${lName}`,
        position: position,
        team: teamName,
        price: parseFloat(priceBase.toFixed(1)),
        totalPoints: 0,
        history: []
    };
}

async function seedDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected.');

        console.log('Clearing existing Player, Team, and Squad collections...');
        await Player.deleteMany({});
        // Clean up broken references for users by clearing Teams/Squads
        await Team.deleteMany({});
        await Squad.deleteMany({});

        const allPlayers = [];

        // 1. Insert known star players
        starPlayers.forEach(sp => {
            allPlayers.push({
                ...sp,
                totalPoints: 0,
                history: []
            });
        });

        // 2. Generate remaining squads (target 25 per team: 3 GK, 8 DEF, 9 MID, 5 FWD)
        const targetSquad = { 'GK': 3, 'DEF': 8, 'MID': 9, 'FWD': 5 };

        for (const team of teamsData) {
            // Count existing star players in this team
            const existingGKs = allPlayers.filter(p => p.team === team.name && p.position === 'GK').length;
            const existingDEFs = allPlayers.filter(p => p.team === team.name && p.position === 'DEF').length;
            const existingMIDs = allPlayers.filter(p => p.team === team.name && p.position === 'MID').length;
            const existingFWDs = allPlayers.filter(p => p.team === team.name && p.position === 'FWD').length;

            // Generate GKs
            for(let i=0; i < targetSquad['GK'] - existingGKs; i++) {
                allPlayers.push(generateRandomPlayer(team.name, 'GK'));
            }
            // Generate DEFs
            for(let i=0; i < targetSquad['DEF'] - existingDEFs; i++) {
                allPlayers.push(generateRandomPlayer(team.name, 'DEF'));
            }
            // Generate MIDs
            for(let i=0; i < targetSquad['MID'] - existingMIDs; i++) {
                allPlayers.push(generateRandomPlayer(team.name, 'MID'));
            }
            // Generate FWDs
            for(let i=0; i < targetSquad['FWD'] - existingFWDs; i++) {
                allPlayers.push(generateRandomPlayer(team.name, 'FWD'));
            }
        }

        // Shuffle the array
        allPlayers.sort(() => Math.random() - 0.5);

        console.log(`Inserting ${allPlayers.length} players into the database...`);
        await Player.insertMany(allPlayers);
        
        console.log('ZPSL Database Seeded Successfully!');
        process.exit(0);

    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seedDB();
