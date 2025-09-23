const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const DigestFetch = require("digest-fetch");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;
const AUDIOSTACJA_URL = process.env.AUDIOSTACJA_URL;
const AUDIOSTACJA_USER = process.env.AUDIOSTACJA_USER;
const AUDIOSTACJA_PASS = process.env.AUDIOSTACJA_PASS;

// klient digest auth
const client = new DigestFetch(AUDIOSTACJA_USER, AUDIOSTACJA_PASS);

app.get("/", (req, res) => {
  res.send("✅ Proxy Audiostacja działa! Użyj /magazyn aby pobrać dane.");
});

app.get("/magazyn", async (req, res) => {
  try {
    const response = await client.fetch(AUDIOSTACJA_URL, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Błąd pobierania: ${response.status}`);
    }

    const xml = await response.text();
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("❌ Błąd proxy:", error.message);
    res.status(500).send("Błąd serwera proxy: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy działa na http://localhost:${PORT}`);
});
