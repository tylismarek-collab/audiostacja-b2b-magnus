import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const SOURCE_URL = process.env.SOURCE_URL || "https://data.audiostacja.pl/Magnus/magazyn.xml";
const SOURCE_USER = process.env.SOURCE_USER;
const SOURCE_PASS = process.env.SOURCE_PASS;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";

app.use(cors({
  origin: ALLOW_ORIGIN === "*" ? true : ALLOW_ORIGIN
}));

app.get("/magazyn", async (req, res) => {
  try {
    const auth = Buffer.from(`${SOURCE_USER}:${SOURCE_PASS}`).toString("base64");
    const response = await axios.get(SOURCE_URL, {
      headers: { "Authorization": `Basic ${auth}` },
      responseType: "text"
    });

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.send(response.data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).send("Błąd serwera proxy: " + err.message);
  }
});

app.get("/healthz", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Proxy działa na http://localhost:${PORT}`);
});
