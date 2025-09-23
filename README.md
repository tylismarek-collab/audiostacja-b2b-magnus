# 🎧 Audiostacja Proxy

Proxy serwer dla `data.audiostacja.pl`, które obsługuje **Digest Auth** i zwraca XML do wykorzystania w dashboardzie B2B.

## 🚀 Technologie
- [Node.js](https://nodejs.org/) (22.x, ESM)
- [Express](https://expressjs.com/)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
- [digest-fetch](https://www.npmjs.com/package/digest-fetch)
- [dotenv](https://www.npmjs.com/package/dotenv)

---

## 📦 Instalacja lokalna

1. Sklonuj repo:
   ```bash
   git clone https://github.com/tylismarek-collab/audiostacja-b2b-magnus.git
   cd audiostacja-b2b-magnus
   ```

2. Zainstaluj zależności:
   ```bash
   npm install
   ```

3. Utwórz plik `.env` (na bazie `.env.example`):
   ```env
   SOURCE_USER=Magnus_Studio
   SOURCE_PASS=twoje_haslo
   SOURCE_URL=https://data.audiostacja.pl/Magnus/magazyn.xml
   ALLOW_ORIGIN=https://audiostacja-b2b.vercel.app
   PORT=3000
   ```

4. Uruchom lokalnie:
   ```bash
   npm start
   ```

   Proxy ruszy na:
   ```
   http://localhost:3000
   ```

---

## 🌍 Endpointy

- `/` → test czy proxy działa  
- `/magazyn` → pobiera i zwraca XML z Audiostacja API  

Przykład:
```bash
curl http://localhost:3000/magazyn
```

---

## 🚀 Deploy na [Render](https://render.com)

1. Połącz repozytorium GitHub z Render.  
2. Wybierz **New Web Service** → wskaż repo.  
3. Build Command:  
   ```bash
   npm install
   ```
4. Start Command:  
   ```bash
   npm start
   ```
5. Ustaw zmienne środowiskowe (`Environment Variables`) w Render → takie same jak w `.env`.

Po deploy proxy dostępne pod:
```
https://twoj-projekt.onrender.com
```

---

## ⚠️ Uwaga
- **401** → błędne dane logowania (`SOURCE_USER`/`SOURCE_PASS`) albo brak Digest Auth.  
- **unable to verify first certificate** → Render czasem wymaga `NODE_TLS_REJECT_UNAUTHORIZED=0`, ale w kodzie jest już to obsłużone.  
- **Nigdy nie commituj swojego `.env`** do GitHub.  

---

## ✅ Status
- [x] Proxy działa lokalnie  
- [x] Deploy na Render  
- [ ] Testy z dashboardem Vercel  
