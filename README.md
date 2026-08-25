# DesignBeen Agency CMS

A React + Express + MySQL rebuild of the supplied DesignBeen agency UI.

## Setup

1. Install frontend dependencies.
   ```bash
   npm install
   ```

2. Install backend dependencies.
   ```bash
   npm install
   ```

3. Configure `.env` from `.env.example`.

4. Create and seed the MySQL database.
   ```sql
   CREATE DATABASE designbeen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

   Import `database/schema.sql` and `database/seed.sql`.

   If the MySQL CLI is not installed, run:
   ```bash
   npm run db:setup
   ```

5. Start the backend.
   ```bash
   npm run dev:server
   ```

6. Start the frontend.
   ```bash
   npm run dev:client
   ```

## Notes

- Public API routes are exposed under `/api`.
- Admin routes are exposed under `/api/admin`.
- Uploaded files are stored in `server/uploads` during development.
- The public UI uses a centralized theme system in `src/theme`.
"# designbeen_website" 
