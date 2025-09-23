import express from "express";
import fetch from "digest-fetch";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serwujemy statyczne pliki z folderu "public"
app.use(express.static("public"));

// Endpoint proxy do magazynu
app.get("/magazyn", async (req, res) => {
  try {
    const client = new fetch(process.env.SOURCE_USER, process.env.SOURCE_PASS, {
      algorithm: "MD5"
    });

    const response = await client.fetch(process.env.SOURCE_URL, {
      agent: new https.Agent({ rejectUnauthorized: false })
    });

    if (!response.ok) {
      throw new Error(`Błąd pobierania: ${response.status}`);
    }

    const data = await response.text();
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(data);
  } catch (err) {
    console.error("❌ Błąd serwera proxy:", err.message);
    res.status(500).send("Błąd serwera proxy: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy działa na http://localhost:${PORT}`);
});
