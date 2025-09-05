##📈 Stock Portfolio Backend API

A simple Node.js + Express backend API that fetches stock data from Yahoo Finance and enriches it with portfolio insights such as P/E ratio, EPS, Net Income, Present Value, and Gain/Loss.

##🚀 Features

Fetches real-time stock data from Yahoo Finance API.

Calculates:

Investment value

Current Market Price (CMP)

Present Value

Gain/Loss (absolute and %)

P/E Ratio

EPS

Latest Net Income (annual/quarterly)

Returns portfolio summary with:

Total Investment

Total Present Value

Total Gain/Loss

Overall Return %

Number of Stocks

🛠️ Tech Stack

Node.js

Express.js

Yahoo Finance API (yahoo-finance2)

CORS

📂 Project Structure
.
├── server.js        # Main server file
├── portfolio.js     # Portfolio data (local JSON/JS array)
├── package.json     # Dependencies & scripts
└── README.md        # Project documentation

⚙️ Installation & Setup

Clone the repo

git clone https://github.com/soumya1925/stocksbackend.git
cd stocksbackend


Install dependencies

npm install


Run locally

npm run dev   # with nodemon (auto-reload)
npm start     # normal start


API will be available at

http://localhost:5000

📡 API Endpoint
GET /

Response Example

{
  "portfolio": [
    {
      "symbol": "AAPL",
      "exchange": "NASDAQ",
      "sector": "Technology",
      "purchasePrice": 150,
      "quantity": 10,
      "investment": 1500,
      "cmp": 170,
      "presentValue": 1700,
      "gainLoss": 200,
      "gainLossPercent": "13.33%",
      "peRatio": 28.45,
      "eps": 6.12,
      "latestNetIncome": "99.80B",
      "portfolioPercent": "25.00"
    }
  ],
  "totals": {
    "totalInvestment": 1500,
    "totalPresentValue": 1700,
    "totalGainLoss": 200,
    "overallReturnPercent": "13.33%",
    "numberOfStocks": 1
  }
}

🌐 Deployment

You can deploy this API on:

Render

Railway

Vercel (serverless)

Ensure your server.js listens on:

const PORT = process.env.PORT || 5000;

📜 Scripts

From package.json:

"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

🙌 Author

👤 Soumya

GitHub: @soumya1925

Would you like me to also create a short section for portfolio.js in the README (explaining its structure and how to add stocks manually)?
