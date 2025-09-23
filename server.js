import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // 👈 ignorowanie błędów certyfikatów

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Proxy Audiostacja działa! Użyj /magazyn aby pobrać dane.");
});

app.get("/magazyn", async (req, res) => {
  try {
    const response = await fetch(process.env.SOURCE_URL, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SOURCE_USER + ":" + process.env.SOURCE_PASS
          ).toString("base64"),
      },
    });

    if (!response.ok) {
      throw new Error(`Błąd pobierania: ${response.status}`);
    }

    const data = await response.text();
    res.set("Content-Type", "application/xml");
    res.send(data);
  } catch (err) {
    res.status(500).send("Błąd serwera proxy: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy działa na http://localhost:${PORT}`);
});
