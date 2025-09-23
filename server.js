import express from "express";
import fetch from "digest-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// wczytanie zmiennych środowiskowych
const SOURCE_URL = process.env.SOURCE_URL;     // np. https://data.audiostacja.pl/Magnus/magazyn.xml
const SOURCE_USER = process.env.SOURCE_USER;   // login
const SOURCE_PASS = process.env.SOURCE_PASS;   // hasło
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";

// endpoint bazowy (test)
app.get("/", (req, res) => {
  res.send("✅ Proxy Audiostacja działa! Użyj /magazyn aby pobrać dane.");
});

// endpoint magazyn
app.get("/magazyn", async (req, res) => {
  try {
    const client = new fetch(SOURCE_USER, SOURCE_PASS, { algorithm: "MD5" });

    // ustawiamy żeby ignorować weryfikację certyfikatu
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const response = await client.fetch(SOURCE_URL, {
      method: "GET",
      headers: { "Content-Type": "application/xml" }
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .send(`Błąd pobierania: ${response.status}`);
    }

    const data = await response.text();

    res.set("Content-Type", "application/xml");
    res.set("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.send(data);
  } catch (err) {
    console.error("❌ Proxy error:", err.message);
    res.status(500).send("Błąd serwera proxy: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy działa na http://localhost:${PORT}`);
});
