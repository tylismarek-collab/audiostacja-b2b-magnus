// server.js
const express = require("express");
const fetch = require("node-fetch");
const https = require("https");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

// Agent SSL z wyłączoną weryfikacją certyfikatu
const agent = new https.Agent({
  rejectUnauthorized: false
});

// Endpoint healthcheck
app.get("/healthz", (req, res) => {
  res.json({ ok: true });
});

// Endpoint proxy do XML
app.get("/magazyn", async (req, res) => {
  try {
    const response = await fetch(process.env.SOURCE_URL, {
      agent,
      headers: {
        "Authorization":
          "Basic " +
          Buffer.from(
            process.env.SOURCE_USER + ":" + process.env.SOURCE_PASS
          ).toString("base64")
      }
    });

    if (!response.ok) {
      throw new Error(`Błąd pobierania: ${response.status}`);
    }

    const xml = await response.text();

    // Ustaw nagłówki
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);

  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).send(`Błąd serwera proxy: ${err.message}`);
  }
});

// Start serwera
app.listen(PORT, () => {
  console.log(`Proxy działa na http://localhost:${PORT}`);
});
