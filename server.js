const express = require("express");
const fetch = require("node-fetch");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 10000;

// Konfiguracja HTTPS (wyłącza sprawdzanie certyfikatu – bo Audiostacja ma problem z certyfikatem)
const agent = new https.Agent({
  rejectUnauthorized: false
});

// LOGIN + HASŁO wpisane na sztywno (testowo!)
const LOGIN = "Magnus_Studio";
const PASSWORD = "9W3HabB25ctk#9F5cojp85@";

app.get("/", (req, res) => {
  res.send("✅ Proxy Audiostacja działa! Użyj <code>/magazyn</code> aby pobrać dane.");
});

app.get("/magazyn", async (req, res) => {
  try {
    const response = await fetch("https://data.audiostacja.pl/Magnus/magazyn.xml", {
      headers: {
        "Authorization": "Basic " + Buffer.from(`${LOGIN}:${PASSWORD}`).toString("base64")
      },
      agent
    });

    if (!response.ok) {
      return res.status(response.status).send(`Błąd pobierania: ${response.status}`);
    }

    const text = await response.text();
    res.set("Content-Type", "application/xml");
    res.send(text);

  } catch (err) {
    res.status(500).send("Błąd serwera proxy: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy działa na http://localhost:${PORT}`);
});
