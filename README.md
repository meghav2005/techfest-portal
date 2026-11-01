# TechFest 2026 Portal (MERN) - Experiment 5

React (Vite) + Express + MongoDB. Security: Helmet, express-mongo-sanitize, express-validator, bcrypt, httpOnly/secure/sameSite cookie, CSRF header, rate limit. CI: GitHub Actions. Deploy: Atlas + Render + Netlify/Vercel.

## 1. Run locally in VS Code
Needs Node 18+ and Git. Database: local MongoDB (default in server/.env) OR an Atlas string.

1. File > Open Folder > `techfest-portal`. Open a terminal (Ctrl+`).
2. Terminal 1 (API):
   ```
   cd server
   npm install
   npm run seed
   npm run dev
   ```
   Open http://localhost:5000/api/health -> `{"status":"ok","mode":"secure"}`.
3. Terminal 2 (website): `cd client`, `npm install`, `npm run dev`, open http://localhost:5173.
4. Tests: `cd server && npm test` (5 tests, no database needed).
Admin login: admin@techfest.dev / Admin@1234. Edit `server/.env` for your own MONGO_URI / JWT_SECRET.

## 2. Vulnerability demos (before / after)
**NoSQL injection.** Seeded demo user: demo@techfest.dev / demo123. Send with Thunder Client / curl:
```
curl -X POST http://localhost:5000/api/demo/login -H "Content-Type: application/json" -d "{\"email\":{\"$gt\":\"\"},\"password\":{\"$gt\":\"\"}}"
```
- BEFORE: in `server/.env` set `SECURITY_MODE=vulnerable`, restart -> "LOGIN SUCCESS" (bypass). Screenshot.
- AFTER: set `SECURITY_MODE=secure`, restart -> 401 Login failed (mongoSanitize removed the `$gt`). Screenshot.
The real `/api/auth/login` also rejects objects with 400 (express-validator).

**XSS.** Log in, post feedback `<img src=x onerror=alert('hi')>` (a `<script>` tag inserted via innerHTML never runs in browsers, so the onerror payload is used).
- BEFORE: in `client/.env` set `VITE_UNSAFE_DEMO=true`, restart `npm run dev` -> popup. Screenshot.
- AFTER: set it to `false` -> shown as plain text. Screenshot.
Also in secure mode, Helmet headers are visible in DevTools > Network > Response Headers.

**Cookies / CSRF.** Login sets `token` as httpOnly + secure (production) + sameSite (DevTools > Application > Cookies). All POST/PUT/DELETE need `X-Requested-With`, so a forged cross-site request fails with 403.

## 3. Git (steps 6-10)
```
git init
git add . && git commit -m "first version"
git branch -M main
git checkout -b feature-page
# edit client/src/pages/Home.jsx heading, then:
git commit -am "Change home heading"
git checkout main && git merge feature-page
# conflict: edit the SAME line of README.md on both branches
git checkout -b branch-a  (edit line 1, commit)   git checkout main
git checkout -b branch-b  (edit line 1 differently, commit)
git merge branch-a        git merge branch-b   # conflict -> fix markers, then
git add . && git commit -m "Resolve merge conflict"
git log --oneline --graph --all     # screenshot
git remote add origin https://github.com/<you>/techfest-portal.git
git push -u origin main
```
`.env` and `node_modules` are in `.gitignore`, so secrets are never pushed.

## 4. CI (step 11)
`.github/workflows/ci.yml` runs server tests and the client build on every push. To show red then green: change an expected value in `server/tests/app.test.js` (e.g. 400 to 200), push, screenshot the red run, revert, push, screenshot green (Actions tab).

## 5. Deploy
1. **Atlas**: free cluster > Database Access (user+password) > Network Access (0.0.0.0/0) > Connect > copy string, add `/techfest2026` before `?`. Run `npm run seed` once locally with that string in `server/.env`.
2. **Render** (API): New > Web Service > repo. Root Directory `server`, Build `npm install`, Start `npm start`. Env: `MONGO_URI`, `JWT_SECRET` (long random), `NODE_ENV=production`, `CLIENT_URL=https://<your-site>.netlify.app`, `ENABLE_DEMO=false`. Check `https://<api>.onrender.com/api/health`.
3. **Netlify** (site): New site from Git. Base directory `client`, build `npm run build`, publish `dist`. Env: `VITE_API_URL=https://<api>.onrender.com/api`. (`netlify.toml` already has the React Router redirect, CSP and caching headers.) Vercel: Root `client`, same env var; `vercel.json` has the rewrite.
4. Update `connect-src` in `client/netlify.toml` if your API is not on onrender.com. Then redeploy.
5. Test live site over https, register, check the `users` collection in Atlas. Render free tier sleeps: first request may take ~50 s.

## 6. Performance (steps 16-17)
Lazy loading: Gallery route (`React.lazy`) and `loading="lazy"` images. `npm run build` in `client` prints gzip sizes (note them). Server uses gzip compression; Netlify headers cache `/assets/*`. Run Lighthouse on the live site before/after fixes and save both reports.

## 7. Report checklist
Architecture: React (Netlify) -> Express API (Render) -> MongoDB Atlas. Add 3 URLs, before/after screenshots, git graph, green CI, Lighthouse before/after, mobile + 2 browsers screenshots.
