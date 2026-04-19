# Birthday RSVP (MERN)

Private birthday invitation + RSVP collector. Guests cannot see other guests’ RSVPs.

- Frontend: React 18 + Vite + Tailwind, React Router, Axios, qrcode.react, date-fns
- Backend: Node 18+ (Express), MongoDB (Mongoose), CORS, Helmet, JWT, BcryptJS, Rate Limit, Zod, Morgan
- Auth: Single admin (host). JWT stored in localStorage.

## Monorepo layout

```
birthday-rsvp/
  client/     # React + Vite + Tailwind
  server/     # Node + Express + MongoDB (Mongoose)
  README.md
  .gitignore
  package.json  # root scripts to run both
```

## Features

- Public landing (`/`):
  - Title: “You’re Invited! 🎉”
  - Event details from env (title, date/time, address)
  - Google Maps embed (iframe via env)
  - Live countdown timer
  - RSVP form (name, optional email, attending Yes/No, optional message up to 300 chars)
  - Success state and QR code of the public invite URL
  - Dark mode toggle (persisted)
- Admin (`/admin`, `/admin/guests`):
  - Login to receive short-lived JWT
  - Guests table with filters and CSV export
  - Logout
- Security: Helmet, strict CORS, rate limits, input validation, no public guest list exposure

## API

Base path: `/api`

- POST `/api/rsvp`
  - Body: `{ name: string (1..80), email?: string, attending: boolean, message?: string (0..300) }`
  - Returns `{ ok: true }`
  - Rate limit: 10 req/IP/hour
- POST `/api/login`
  - Body: `{ email: string, password: string }`
  - Compares to ENV admin creds; supports ADMIN_PASSWORD or ADMIN_PASSWORD_HASH
  - Returns `{ token, expiresIn }`
- GET `/api/guests` (auth required: `Authorization: Bearer <token>`) → list of RSVPs sorted desc
- GET `/api/health` → `{ status: 'ok' }`

Mongoose schema (`server/src/models/Rsvp.js`):

```js
const RsvpSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, trim: true, lowercase: true },
  attending: { type: Boolean, required: true },
  message: { type: String, trim: true, maxlength: 300 },
  createdAt: { type: Date, default: Date.now }
});
```

## Environment variables

Backend `server/ENV.example` (copy to `.env` and fill):

```
PORT=8080
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<generate a long random string>
ADMIN_EMAIL=you@example.com
# Choose ONE of the following:
ADMIN_PASSWORD=<plaintext-for-dev>
# or
ADMIN_PASSWORD_HASH=<bcrypt-hash-for-prod>
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Generate bcrypt hash locally (after installing bcryptjs):

```
node -e "console.log(require('bcryptjs').hashSync('<YOUR_PASSWORD>', 10))"
```

Frontend `client/ENV.example` (copy to `.env`):

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_EVENT_TITLE=Dev’s Birthday Bash
VITE_EVENT_DATE_ISO=2025-09-01T19:00:00+05:30
VITE_EVENT_ADDRESS=Dev’s Place, Vadodara
VITE_MAPS_EMBED_SRC=https://www.google.com/maps/embed?pb=<YOUR_EMBED_CODE>
```

## Local development (Node 18+, npm, Git)

Exact commands:

```
# 1) Create repo
mkdir birthday-rsvp && cd birthday-rsvp
git init
git branch -m main

# 2) Root package.json for convenience scripts
npm init -y

# 3) Create client app (Vite)
npm create vite@latest client -- --template react
cd client
npm i axios react-router-dom qrcode.react date-fns
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# Configure tailwind.config.js: content includes ./index.html and ./src/**/*.{js,jsx}
# Set darkMode: 'class'
# Add @tailwind base; @tailwind components; @tailwind utilities in src/index.css

# 4) Create server
cd ..
mkdir server && cd server
npm init -y
npm i express mongoose cors dotenv helmet bcryptjs jsonwebtoken morgan express-rate-limit
npm i zod # or: npm i express-validator
# Dev deps optional:
npm i -D nodemon
# Create src files as specified

# 5) Add root scripts to run both
cd ..

# (In this repo, these files are already created for you.)

# Install root dev helper
npm i -D concurrently

# Run locally (two terminals or use the root script with concurrently):
# terminal 1
npm run dev
# Client on http://localhost:5173 (Vite default)
# Server on http://localhost:8080
```

Commit:

```
git add .
git commit -m "feat: initial MERN private RSVP app with maps, QR, dark mode, countdown"
```

Create GitHub repo and push:

```
# If you use GitHub CLI
gh repo create birthday-rsvp --public --source=. --remote=origin --push
# or do it manually on GitHub then:
git remote add origin <your-repo-url>
git push -u origin main
```

## MongoDB Atlas setup

1. Create free cluster, database user and password.
2. Network Access: allow backend IPs (or 0.0.0.0/0 for quick start).
3. Put connection string in `server/.env` as `MONGODB_URI`.
4. Start backend and ensure successful connection log.

## Deploy backend (Render recommended)

Render

- New → Web Service → Connect your GitHub repo → pick `server` directory.
- Runtime: Node 18+.
- Build command: blank (plain Node) or `npm install`.
- Start command: `npm start`.
- Env vars: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, (`ADMIN_PASSWORD` OR `ADMIN_PASSWORD_HASH`), `CORS_ORIGIN` (your frontend URL), `PORT` (Render provides), `NODE_ENV=production`.
- Deploy → note the backend URL (e.g., `https://birthday-rsvp-backend.onrender.com`).

Heroku (alt)

```
heroku create birthday-rsvp-backend
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...
heroku config:set ADMIN_EMAIL=...
heroku config:set ADMIN_PASSWORD=...   # or ADMIN_PASSWORD_HASH=...
heroku config:set CORS_ORIGIN=https://your-frontend-domain.tld
heroku config:set NODE_ENV=production
# Push just the server subtree if needed
git subtree push --prefix server heroku main
```

## Deploy frontend (Vercel or Netlify)

Vercel

- New Project → Import your repo → set Root Directory = `client`.
- Build command: `npm run build`
- Output dir: `dist`
- Env vars:
  - `VITE_API_BASE_URL=https://your-backend-domain/api`
  - `VITE_EVENT_TITLE=...`
  - `VITE_EVENT_DATE_ISO=...`
  - `VITE_EVENT_ADDRESS=...`
  - `VITE_MAPS_EMBED_SRC=...`
- Deploy → set custom domain if desired.

Netlify

- New site from Git → Root = `client/`
- Build: `npm run build`
- Publish directory: `dist`
- Add env vars same as above.
- Deploy.

After frontend deploys, update the backend `CORS_ORIGIN` to the final frontend URL if you used a temporary domain during testing.

## Admin usage

- Visit `/admin` on the frontend, login with `ADMIN_EMAIL` + password.
- On success, JWT saved to localStorage, then navigate to `/admin/guests`.
- You can:
  - Filter attending yes/no/all
  - Export CSV
  - Logout

## Testing checklist

Local:

- GET `/api/health` → `{ status: 'ok' }`
- Submit `/api/rsvp` with valid/invalid payloads
- Login `/api/login` with correct/incorrect creds
- Authenticated GET `/api/guests` returns list

Production:

- From frontend, submit real RSVP and confirm success UI.
- Admin login works on deployed domain.
- CORS OK (no browser errors).
- Timezone: countdown uses browser local time (event ISO includes offset).

## Troubleshooting

- CORS: Ensure backend `CORS_ORIGIN` matches your frontend URL exactly (scheme + domain + port).
- Env vars: Ensure both client and server have `.env` from the provided `ENV.example` files.
- JWT errors: Token expired → login again; ensure system clocks are correct.
- Mongo connection: Check `MONGODB_URI`, IP allowlist (Atlas), and network.

## License

MIT
