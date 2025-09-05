// const express = require("express");
// const yahooFinance = require("yahoo-finance2").default;

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Example static portfolio (replace with DB later)
// const portfolio = require("./portfolio");

// // Helper → fetch P/E ratio + EPS + latest quarterly earnings from Yahoo
// async function fetchYahooFinance(symbol) {
//   try {
//     const modules = ["summaryDetail", "defaultKeyStatistics", "earningsHistory"];
//     const data = await yahooFinance.quoteSummary(symbol, { modules });

//     // P/E ratio (trailing or forward fallback)
//     const peRatio =
//       data.summaryDetail?.trailingPE ||
//       data.summaryDetail?.forwardPE ||
//       "N/A";

//     // EPS (TTM)
//     const eps = data.defaultKeyStatistics?.trailingEps || "N/A";

//     // Latest quarterly EPS from earningsHistory
//     let latestQuarterEarnings = "N/A";
//     const history = data.earningsHistory?.history;
//     if (history && history.length > 0) {
//       const latestQ = history[history.length - 1];
//       latestQuarterEarnings = latestQ?.epsActual?.raw || "N/A";
//     }

//     return {
//       peRatio,
//       eps,
//       latestQuarterEarnings,
//     };
//   } catch (err) {
//     console.error(`❌ Yahoo fetch failed for ${symbol}:`, err.message);
//     return { peRatio: "N/A", eps: "N/A", latestQuarterEarnings: "N/A" };
//   }
// }

// // API route → return portfolio JSON
// app.get("/", async (req, res) => {
//   try {
//     let totalInvestment = 0;

//     const enriched = await Promise.all(
//       portfolio.map(async (stock) => {
//         const investment = stock.purchasePrice * stock.quantity;
//         totalInvestment += investment;

//         // Fetch CMP from Yahoo
//         let cmp = null;
//         try {
//           const yahooData = await yahooFinance.quote(stock.symbol);
//           cmp = yahooData?.regularMarketPrice || null;
//         } catch (e) {
//           console.error(`Yahoo fetch failed for ${stock.symbol}:`, e.message);
//         }

//         // Fetch P/E ratio & earnings from Yahoo
//         const yahooExtra = await fetchYahooFinance(stock.symbol);

//         // If CMP is missing, set defaults
//         const presentValue = cmp ? cmp * stock.quantity : 0;
//         const gainLoss = presentValue - investment;

//         return {
//           ...stock,
//           investment,
//           cmp: cmp || "N/A",
//           presentValue,
//           gainLoss,
//           ...yahooExtra,
//         };
//       })
//     );

//     const finalPortfolio = enriched.map((stock) => ({
//       ...stock,
//       portfolioPercent: totalInvestment
//         ? ((stock.investment / totalInvestment) * 100).toFixed(2)
//         : "0.00",
//     }));

//     res.json({
//       portfolio: finalPortfolio,
//       totals: {
//         totalInvestment,
//         totalPresentValue: finalPortfolio.reduce(
//           (sum, s) => sum + (s.presentValue || 0),
//           0
//         ),
//         totalGainLoss: finalPortfolio.reduce(
//           (sum, s) => sum + (s.gainLoss || 0),
//           0
//         ),
//       },
//     });
//   } catch (err) {
//     console.error("❌ Portfolio API failed:", err);
//     res.status(500).json({ error: "Failed to fetch portfolio data" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });






const express = require("express");
const yahooFinance = require("yahoo-finance2").default;
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const portfolio = require("./portfolio");


async function fetchYahooFinance(symbol) {
  try {
    const modules = [
      "summaryDetail",
      "defaultKeyStatistics",
      "price",
      "incomeStatementHistory",
      "incomeStatementHistoryQuarterly"
    ];
    const data = await yahooFinance.quoteSummary(symbol, { modules });

    // P/E ratio (robust fallback)
    const peRatio =
      (data.summaryDetail?.trailingPE?.raw ??
        data.summaryDetail?.trailingPE ??
        data.summaryDetail?.forwardPE?.raw ??
        data.summaryDetail?.forwardPE ??
        "N/A");

    // EPS (TTM)
    const eps =
      data.defaultKeyStatistics?.trailingEps?.raw ??
      data.defaultKeyStatistics?.trailingEps ??
      "N/A";

    // Latest Net Income (annual or quarterly statements first)
    let latestNetIncome = "N/A";
    const annuals = data.incomeStatementHistory?.incomeStatementHistory || [];
    const quarterlies =
      data.incomeStatementHistoryQuarterly?.incomeStatementHistory || [];

    const latestStatement = annuals[0] || quarterlies[0];
    if (latestStatement) {
      latestNetIncome =
        latestStatement.netIncome?.raw ??
        latestStatement.netIncomeApplicableToCommonShares?.raw ??
        "N/A";
    }

    // --- Fallback calculations if Net Income is N/A ---
    if (latestNetIncome === "N/A") {
      // Option 1: Market Cap / PE
      const marketCap = data.price?.marketCap?.raw;
      if (marketCap && peRatio && peRatio !== "N/A" && peRatio > 0) {
        latestNetIncome = marketCap / peRatio;
      }
      // Option 2: EPS × Shares Outstanding
      else if (
        eps !== "N/A" &&
        data.defaultKeyStatistics?.sharesOutstanding
      ) {
        const sharesOutstanding =
          data.defaultKeyStatistics.sharesOutstanding.raw ??
          data.defaultKeyStatistics.sharesOutstanding;
        latestNetIncome = eps * sharesOutstanding;
      }
    }

    // Format latestNetIncome for readability
    if (latestNetIncome !== "N/A" && typeof latestNetIncome === "number") {
      if (latestNetIncome >= 1e9) {
        latestNetIncome = (latestNetIncome / 1e9).toFixed(2) + "B";
      } else if (latestNetIncome >= 1e6) {
        latestNetIncome = (latestNetIncome / 1e6).toFixed(2) + "M";
      } else if (latestNetIncome >= 1e3) {
        latestNetIncome = (latestNetIncome / 1e3).toFixed(2) + "K";
      } else {
        latestNetIncome = latestNetIncome.toFixed(2);
      }
    }

    return {
      peRatio,
      eps,
      latestNetIncome,
    };
  } catch (err) {
    console.error(`❌ Yahoo fetch failed for ${symbol}:`, err.message);
    return {
      peRatio: "N/A",
      eps: "N/A",
      latestNetIncome: "N/A",
    };
  }
}


app.use(cors({
  origin: "http://localhost:3000"
}));

// API route → return portfolio JSON
app.get("/", async (req, res) => {
  try {
    let totalInvestment = 0;

    const enriched = await Promise.all(
      portfolio.map(async (stock) => {
        const investment = stock.purchasePrice * stock.quantity;
        totalInvestment += investment;

        // Fetch CMP from Yahoo
        let cmp = null;
        try {
          const yahooData = await yahooFinance.quote(stock.symbol);
          cmp = yahooData?.regularMarketPrice || null;
        } catch (e) {
          console.error(`Yahoo fetch failed for ${stock.symbol}:`, e.message);
        }

        // Fetch extra data (P/E, EPS, Net Income)
        const yahooExtra = await fetchYahooFinance(stock.symbol);

        // Calculate values
        const presentValue = cmp ? cmp * stock.quantity : 0;
        const gainLoss = presentValue - investment;
        const gainLossPercent = investment
          ? ((gainLoss / investment) * 100).toFixed(2)
          : "0.00";

        return {
          symbol: stock.symbol,
          exchange: stock.exchange,
          sector: stock.sector,
          purchasePrice: stock.purchasePrice,
          quantity: stock.quantity,
          investment,
          cmp: cmp || "N/A",
          presentValue,
          gainLoss,
          gainLossPercent: gainLossPercent + "%",
          peRatio: yahooExtra.peRatio,
          eps: yahooExtra.eps,
          latestNetIncome: yahooExtra.latestNetIncome,
        };
      })
    );

    const finalPortfolio = enriched.map((stock) => ({
      ...stock,
      portfolioPercent: totalInvestment
        ? ((stock.investment / totalInvestment) * 100).toFixed(2)
        : "0.00",
    }));

    // Totals
    const totalPresentValue = finalPortfolio.reduce(
      (sum, s) => sum + (s.presentValue || 0),
      0
    );
    const totalGainLoss = finalPortfolio.reduce(
      (sum, s) => sum + (s.gainLoss || 0),
      0
    );
    const overallReturnPercent = totalInvestment
      ? ((totalGainLoss / totalInvestment) * 100).toFixed(2)
      : "0.00";

    res.json({
      portfolio: finalPortfolio,
      totals: {
        totalInvestment,
        totalPresentValue,
        totalGainLoss,
        overallReturnPercent: overallReturnPercent + "%",
        numberOfStocks: finalPortfolio.length,
      },
    });
  } catch (err) {
    console.error("❌ Portfolio API failed:", err);
    res.status(500).json({ error: "Failed to fetch portfolio data" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
