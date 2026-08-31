# DesignBeen Agency CMS (Next.js + MySQL2 + Vercel Ready)

A unified Next.js (App Router) + MySQL2 CMS rebuild of the DesignBeen agency website. Optimized for high performance and seamless deployment to **Vercel** and serverless MySQL providers (PlanetScale, Railway, Aiven, AWS RDS, etc.).

## Features

- **Next.js App Router**: Unified frontend and serverless API routes (`/api/...` and `/api/admin/...`).
- **MySQL2 Serverless Connection Pool**: Optimized pool initialization with connection reuse across serverless functions.
- **Dynamic Serverless Image Uploads**: Uploaded images are stored directly in MySQL (`uploads` table) and served dynamically via `/api/uploads/[id]`, requiring zero external storage buckets (S3/Cloudinary) when deployed on Vercel.
- **Full CMS Admin Dashboard**: Manage services, projects, testimonials, technologies, team members, partners, navigation items, site settings, and contact messages.
- **Theme Customization**: Live dynamic CSS variables for theme presets (light/dark/custom colors).

---

## Setup & Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=designbeen
   DB_USER=root
   DB_PASSWORD=
   DB_SSL=false
   JWT_SECRET=change-me-in-production-jwt-secret-key-12345
   ```

3. **Initialize Database**:
   Run the database setup script to create tables and seed default admin user (`admin@designbeen.com` / `admin123`):
   ```bash
   npm run db:setup
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel

1. Push code to your Git repository (GitHub/GitLab/Bitbucket).
2. Import the repository into **Vercel**.
3. In Vercel Project Settings -> **Environment Variables**, set:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_SSL` (or `DATABASE_URL` / `MYSQL_URL`)
   - `JWT_SECRET`
4. Trigger deployment on Vercel.
5. Once deployed, initialize your production database schema by visiting or triggering:
   `POST https://<your-vercel-domain>/api/db/setup`
