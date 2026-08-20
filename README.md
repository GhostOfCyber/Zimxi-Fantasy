

https://github.com/user-attachments/assets/e215fbfe-0826-4cb2-87a0-b9514a6cf564



# Betterbrands Fantasy League (Zimbabwe)

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

A full-stack Javascript Monorepo for the Zimbabwe Fantasy Football League. This platform allows users to create and manage their fantasy football teams based on the Zimbabwe Premier Soccer League (PSL), tracking player performances, points, and league standings.

## 🌟 Features & Core Business Logic

### 1. Squad Selection Rules
- **15-Player Squad**: Users must select exactly 15 players (2 Goalkeepers, 5 Defenders, 5 Midfielders, and 3 Forwards).
- **Budget Constraint**: The total cost of the squad must not exceed the $100.0m virtual budget limit.

### 2. Matchday Lineups
- **Starting XI**: From the 15-player squad, users pick 11 starters. The 4 benched players will not earn points unless a specific chip is activated.
- **Captains**: Users select 1 Captain (earns double points) and 1 Vice-Captain (earns double points if the Captain doesn't play).
- **Auto-picker**: Defaults to a standard formation when making transfers so users always have a valid lineup.

### 3. Power-up Chips
Users have access to classic fantasy chips that can be used once per season:
- **Bench Boost (BB)**: Points from all 15 players count for the gameweek.
- **Triple Captain (TC)**: The captain's points are tripled instead of doubled.
- **Free Hit (FH)**: Make unlimited free transfers for one gameweek.
- **Wildcard (WC)**: Make unlimited permanent transfers.

### 4. Admin Operations & Points Engine
- **Data Management**: Admin tools to upload bulk player data (JSON/CSV) and create fixtures.
- **Dynamic Points Calculation**: The backend points engine computes gameweek scores based on real-world player stats (minutes played, goals, assists, clean sheets, cards).
- **Automated Tallying**: Seamlessly iterates over all completed fixtures and credits points globally to all users who own active players.

### 5. Technical Features
- **User Authentication**: Secure signup and login using JWT & bcrypt.
- **Interactive UI**: Responsive and modern interface built with React, React Query, and TailwindCSS.

## 🛠 Tech Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) (bootstrapped with [Vite](https://vitejs.dev/))
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State/Data Management**: [React Query (@tanstack/react-query)](https://tanstack.com/query/latest)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (managed via Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Uploads/Parsing**: Multer & csv-parse (for processing player data)

### Infrastructure
- **Containerization**: [Docker](https://www.docker.com/) & Docker Compose (for local database setup)
- **Monorepo Management**: `concurrently`

---

## 🚀 Quick Start

### 1. Prerequisites
Make sure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/download/) (v18 or higher)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop)
- Git

### 2. Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "zimxi fpl"
   ```

2. **Install Dependencies**
   Run the following command from the root directory to install dependencies for the root, frontend, and backend simultaneously:
   ```bash
   npm run install-all
   ```

3. **Environment Variables**
   - Create a `.env` file in the root and/or `backend/` directory based on any `.env.example` if available. Ensure `MONGO_URI` is correctly pointing to your local Docker instance (e.g., `mongodb://localhost:27017/betterbrands_fantasy`).

4. **Start the Database**
   Fire up the MongoDB container using Docker Compose:
   ```bash
   docker-compose up -d
   ```
   *This starts a local MongoDB instance running on port 27017.*

5. **Seed Initial Data (Optional but Recommended)**
   Populate your local database with initial PSL players and teams:
   ```bash
   npm run seed
   ```

### 3. Run the Development Servers

From the root directory, start both the Express backend and the Vite frontend simultaneously:
```bash
npm run dev
```

- **Frontend**: Available at `http://localhost:5173`
- **Backend API**: Running on `http://localhost:5000` (or whichever port is defined in `.env`)

---

## 📂 Project Structure

```text
zimxi-fpl/
├── backend/
│   ├── config/          # Database & environment configurations
│   ├── controllers/     # Route logic & request handling
│   ├── middleware/      # Custom Express middlewares (e.g., Auth)
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # API route definitions
│   ├── scripts/         # Utility scripts (e.g., db seeder)
│   ├── services/        # Business logic & external API interactions
│   └── server.js        # Express application entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/             # React application source code
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   └── ...          
│   ├── index.html       # Vite entry HTML
│   └── vite.config.js   # Vite configuration
├── docker-compose.yml   # MongoDB container configuration
└── package.json         # Root monorepo scripts & dependencies
```

## 🧪 Testing

The backend is configured with Jest for unit testing.
To run the backend tests:
```bash
cd backend
npm test
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.#
