# Setup guide

This guide takes a fresh machine to all three Grovia apps running locally. If you already have Node 22, pnpm 11 and a MongoDB connection string, the [Quick start in the README](./README.md#quick-start) is enough.

- [1. Install Node.js 22](#1-install-nodejs-22)
- [2. Install pnpm 11](#2-install-pnpm-11)
- [3. Get a MongoDB database](#3-get-a-mongodb-database)
- [4. Clone and install](#4-clone-and-install)
- [5. Create the environment file](#5-create-the-environment-file)
- [6. Run the apps](#6-run-the-apps)
- [7. Check that everything works](#7-check-that-everything-works)
- [8. Editor setup](#8-editor-setup)
- [9. Push to your own repository](#9-push-to-your-own-repository)

---

## 1. Install Node.js 22

Next.js 16 needs Node **20.9 or newer**. The repo pins **22** in `.nvmrc`.

**With a version manager (recommended):**

```bash
# macOS / Linux: nvm (https://github.com/nvm-sh/nvm)
nvm install      # reads .nvmrc
nvm use

# Windows: nvm-windows (https://github.com/coreybutler/nvm-windows)
nvm install 22
nvm use 22
```

Or download the LTS installer from [nodejs.org](https://nodejs.org). Then check it:

```bash
node -v    # v22.x.x
```

## 2. Install pnpm 11

pnpm keeps one copy of every package on disk and links it into each app. It's also strict, so an app can only import what its own `package.json` lists.

```bash
corepack enable pnpm      # Corepack ships with Node
# or
npm install -g pnpm@11
```

```bash
pnpm -v    # 11.x
```

The root `package.json` pins the exact version (`11.21.0`) under `devEngines`. If yours differs, pnpm downloads the pinned one automatically.

## 3. Get a MongoDB database

Choose one option. You only need its connection string.

### Option A: MongoDB Atlas (free, nothing to install)

1. Sign up at [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and create a free **M0** cluster.
2. **Database Access** → *Add New Database User*: choose a username and password. Avoid `@`, `:` and `/` in the password, or URL-encode them.
3. **Network Access** → *Add IP Address* → *Add Current IP Address*. For quick testing, `0.0.0.0/0` allows any IP. Remove it later.
4. **Connect** → *Drivers* → copy the string, then add the database name `grovia` before the `?`:

   ```text
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/grovia?retryWrites=true&w=majority
   ```

### Option B: Docker

```bash
docker run -d --name grovia-mongo -p 27017:27017 -v grovia-mongo:/data/db mongo:8
```

Connection string: `mongodb://127.0.0.1:27017/grovia`

### Option C: Install MongoDB locally

- **macOS (Homebrew):**
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community
  ```
- **Windows:** install [MongoDB Community Server](https://www.mongodb.com/try/download/community) and choose *Install as a Service*.
- **Linux:** follow the [official guide](https://www.mongodb.com/docs/manual/administration/install-on-linux/) for your distribution.

Connection string: `mongodb://127.0.0.1:27017/grovia`

> [MongoDB Compass](https://www.mongodb.com/products/tools/compass) is a free GUI for looking inside the database. It's handy from chapter 2.11 on, once the seed has loaded data.

## 4. Clone and install

```bash
git clone https://github.com/noorjsdivs/grovia-starter.git
cd grovia-starter
```

Then either run the setup script, which does steps 4 and 5 for you:

```bash
node setup.mjs
```

or install by hand:

```bash
pnpm install
```

One install covers all three apps. pnpm 11 only runs the install scripts listed under `allowBuilds` in `pnpm-workspace.yaml` (esbuild, sharp, the Sentry CLI and two others). This is a supply-chain safety feature. If a later chapter adds a package that needs its install script, pnpm tells you, and you add it to that list.

## 5. Create the environment file

Grovia uses **one** `.env` file, at the repo root, for every app. If you ran `node setup.mjs`, it's already there. Otherwise:

```bash
cp _.env.example .env                 # macOS / Linux / Git Bash
Copy-Item _.env.example .env          # Windows PowerShell
```

Open `.env` and set the two required values:

```bash
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/grovia?retryWrites=true&w=majority
JWT_SECRET=<a long random string>
```

Generate the secret with either of these:

```bash
openssl rand -base64 32
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

The rest of the template already points at localhost. Optional variables for later chapters (Stripe, ImageKit or Cloudinary, SMTP, Google sign-in, Redis, Sentry) are listed commented out. Leave them until a chapter asks for them.

**Why `_.env.example` and not `.env.example`?** A leading dot hides a file in Finder and Explorer. The underscore keeps the template visible to anyone who downloads the repo as a zip.

**Why one file?** Four apps with four `.env` files drift apart, and then the API runs on one port while the storefront calls another. With one file, there's one source of truth. The API finds it by walking up from `apps/api/config/env.ts` to the folder that has `pnpm-workspace.yaml`, and the Next.js apps load it in `next.config.ts`.

## 6. Run the apps

```bash
pnpm run dev            # all three, through Turbo
```

or one at a time, each in its own terminal:

```bash
pnpm run dev:api        # http://localhost:8000
pnpm run dev:web        # http://localhost:3000
pnpm run dev:admin      # http://localhost:3001
```

## 7. Check that everything works

**API**

```bash
curl -i http://localhost:8000/api/health
```

```text
HTTP/1.1 200 OK
X-Request-Id: 3f1c…
{"ok":true,"status":"healthy","db":"connected","uptime":12,"environment":"development","timestamp":"…"}
```

- `503` with `"db":"disconnected"` means the API is running but can't reach MongoDB. Recheck `MONGO_URI`, and on Atlas, recheck Network Access. The API retries on its own (5 s, 10 s, 20 s, then every 30 s), so you don't need to restart it.
- Once the database is connected, an unknown route returns a JSON envelope rather than an HTML error page:

  ```bash
  curl http://localhost:8000/api/nope
  # {"success":false,"code":"not_found","message":"No route for GET /api/nope","path":"/api/nope","requestId":"…"}
  ```

**Storefront:** http://localhost:3000 shows the Grovia logo, a headline in TikTok Sans, three buttons and six colour swatches. That page exists to prove the fonts, tokens and primitives render. Chapter 3.08 replaces it with the real home page.

**Dashboard:** http://localhost:3001 shows a "Dashboard" page header. Chapter 4.03 adds the sidebar shell around it, and 4.05 turns it into the live overview.

**The full gate** (CI runs the same thing):

```bash
pnpm run type-check && pnpm run lint && pnpm run test && pnpm run build
```

## 8. Editor setup

[VS Code](https://code.visualstudio.com) offers to install the recommended extensions when you open the folder (`.vscode/extensions.json`):

- **ESLint** (`dbaeumer.vscode-eslint`): shows lint errors inline, including the `no-explicit-any` rule.
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`): autocompletes the semantic tokens from each app's `globals.css`.

If you use Claude Code or another AI assistant, [CLAUDE.md](./CLAUDE.md) gives it the project's ground rules.

## 9. Push to your own repository

To keep your course progress on GitHub:

```bash
git remote rename origin upstream          # keep this repo as "upstream"
git remote add origin git@github.com:<you>/grovia.git
git push -u origin main
```

`.env` is git-ignored, so it never leaves your machine. Check with `git status` before every first push. If a secret is ever pushed, treat it as leaked and rotate it. Deleting the commit isn't enough.

---

Something not covered here? [Open an issue](https://github.com/noorjsdivs/grovia-starter/issues), or ask under the course video on [YouTube](https://www.youtube.com/@reactjsBD).
