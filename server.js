import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import DigestFetch from "digest-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const USER = process.env.SOURCE_USER;
const PASS = process.env.SOURCE_PASS;
const SOURCE_URL = process.env.SOURCE_URL;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";

// klient digest auth
const client = new DigestFetch(USER, PASS);

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// test root
app.get("/", (req, res) => {
  res.send("✅ Proxy Audiostacja działa! Użyj /magazyn aby pobrać dane.");
});

// endpoint proxy
app.get("/magazyn", async (req, res) => {
  try {
    const response = await client.fetch(SOURCE_URL);

    if (!response.ok) {
      return res
        .status(response.status)
        .send(`Błąd pobierania: ${response.status}`);
    }

    const data = await response.text();
    res.type("application/xml").send(data);
  } catch (error) {
    res.status(500).send(`Błąd serwera proxy: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy działa na http://localhost:${PORT}`);
});
