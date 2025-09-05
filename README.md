# 📈 Stocks Portfolio Backend API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey?logo=express)
![YahooFinance](https://img.shields.io/badge/API-YahooFinance-blue?logo=yahoo)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

A backend API built with **Node.js + Express** that fetches stock data from **Yahoo Finance** and enriches it with portfolio metrics like **P/E Ratio, EPS, Net Income, Present Value, and Gain/Loss**.
- **Backend (Express API)** 👉 [https://stocksapi-qp3k.onrender.com](https://stocksapi-qp3k.onrender.com) 

---

## 🚀 Features
- 📊 Real-time stock data via Yahoo Finance  
- 🧮 Calculates investment value, present value, gain/loss %  
- 📈 Enriches portfolio with P/E ratio, EPS, net income  
- 📦 Returns portfolio totals & stock-wise breakdown  

---
# 📈 Stocks Portfolio Backend API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey?logo=express)
![YahooFinance](https://img.shields.io/badge/API-YahooFinance-blue?logo=yahoo)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

A backend API built with **Node.js + Express** that fetches stock data from **Yahoo Finance** and enriches it with portfolio insights.

---

## 🚀 What It Calculates

For each stock in your portfolio:
- 💰 **Investment Value**
- 💹 **Current Market Price (CMP)**
- 📊 **Present Value**
- 📈 **Gain/Loss** (absolute and %)
- 📉 **P/E Ratio**
- 🧮 **EPS (Earnings per Share)**
- 🏦 **Latest Net Income** (annual or quarterly)

---

## 📊 Portfolio Summary

In addition, the API returns overall portfolio metrics:
- 💵 **Total Investment**
- 📈 **Total Present Value**
- 📊 **Total Gain/Loss**
- 📉 **Overall Return %**
- 🔢 **Number of Stocks**


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

# 📈 Stocks Portfolio Backend API

A simple backend API built with **Node.js + Express** that fetches stock data from **Yahoo Finance** and calculates portfolio performance.

---

## ⚙️ Installation & Setup

### Clone the repo
```bash
git clone https://github.com/soumya1925/stocksbackend.git
cd stocksbackend
Install dependencies
bash
Copy code
npm install
Run locally
bash
Copy code
npm run dev   # with nodemon (auto-reload)
npm start     # normal start
API will be available at
arduino
Copy code
http://localhost:5000
📡 API Endpoint
GET /
Response Example
json
Copy code
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
```

🌐 Deployment
Page is live ar Deployment link: https://frontendstocksmarket-jg0sl4iti-soumya-rouls-projects.vercel.app 
You can deploy this API on:
Render

Railway

Vercel

Ensure your server.js listens on:

js
Copy code
const PORT = process.env.PORT || 5000;
📜 Scripts
From package.json:

json
Copy code
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
🙌 Author
👤 Soumya

GitHub: @soumya1925
