const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('node:path');
require('dotenv').config();
const { query } = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1 AS ready');
    res.json({ success: true, status: 'ok', database: 'ready' });
  } catch (error) {
    const databaseFailure = error instanceof Error ? error.message : 'Unknown database failure';
    req.app.locals.lastDatabaseFailure = databaseFailure;
    res.status(503).json({ success: false, status: 'degraded', database: 'unavailable' });
  }
});

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
