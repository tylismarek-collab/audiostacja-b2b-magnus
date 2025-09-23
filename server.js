// server.js (CommonJS)
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 10000;

// --- KONFIG ---
const SOURCE_URL = "https://data.audiostacja.pl/Magnus/magazyn.xml";

// UŻYJ ENV, ale jeśli ich nie ma – leci na „sztywno” (żebyś mógł od razu sprawdzić)
const LOGIN = process.env.MAGNUS_USER || "Magnus_Studio";
const PASSWORD = process.env.MAGNUS_PASS || "9W3HabB25ctk#9F5cojp85@";

// Agent HTTPS: wyłączona weryfikacja certyfikatu + keepAlive
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Proxy Audiostacja działa! Użyj /magazyn aby pobrać dane.");
});

app.get("/magazyn", async (req, res) => {
  try {
    const response = await axios.get(SOURCE_URL, {
      httpsAgent,
      responseType: "text",
      // typowe nagłówki jak z przeglądarki
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        "Accept": "application/xml,text/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pl,en;q=0.9"
      },
      // najpewniejszy sposób Basic Auth
      auth: { username: LOGIN, password: PASSWORD },
      // nie rzucaj wyjątku przy 401/403 – pokażemy to czytelnie
      validateStatus: () => true,
      timeout: 15000
    });

    if (response.status !== 200) {
      const wa = response.headers?.["www-authenticate"];
      const info = wa ? ` (WWW-Authenticate: ${wa})` : "";
      return res
        .status(response.status)
        .send(`Błąd pobierania: ${response.status}${info}`);
    }

    res.set("Content-Type", "application/xml; charset=utf-8");
    return res.status(200).send(response.data);

  } catch (err) {
    console.error("Proxy error:", err?.message || err);
    return res.status(500).send("Błąd serwera proxy: " + (err?.message || err));
  }
});

app.listen(PORT, () => {
  console.log(`Proxy działa na http://localhost:${PORT}`);
});
