require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");

// 🔥 fix SSL cert error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
const PORT = process.env.PORT || 10000;

// Endpoint testowy
app.get("/", (req, res) => {
  res.send("✅ Proxy Audiostacja działa! Użyj /magazyn aby pobrać dane.");
});

// Endpoint główny
app.get("/magazyn", async (req, res) => {
  try {
    const response = await fetch("https://data.audiostacja.pl/Magnus/magazyn.xml", {
      headers: {
        "Authorization": "Basic " + Buffer.from(
          `${process.env.MAGNUS_USER}:${process.env.MAGNUS_PASS}`
        ).toString("base64")
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(`Błąd pobierania: ${response.status}`);
    }

    const text = await response.text();
    res.type("application/xml").send(text);

  } catch (err) {
    res.status(500).send("Błąd serwera proxy: " + err.message);
  }
});

// Start
app.listen(PORT, () => {
  console.log(`Proxy działa na http://localhost:${PORT}`);
});
