import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // 1. Create tables if not existing
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'editor') NOT NULL DEFAULT 'admin',
        active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uniq_users_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        site_key VARCHAR(64) NOT NULL DEFAULT 'default',
        site_name VARCHAR(190) NOT NULL,
        site_tagline VARCHAR(190) DEFAULT NULL,
        logo_url VARCHAR(255) DEFAULT NULL,
        favicon_url VARCHAR(255) DEFAULT NULL,
        email VARCHAR(190) DEFAULT NULL,
        phone VARCHAR(60) DEFAULT NULL,
        address VARCHAR(255) DEFAULT NULL,
        instagram_url VARCHAR(255) DEFAULT NULL,
        linkedin_url VARCHAR(255) DEFAULT NULL,
        behance_url VARCHAR(255) DEFAULT NULL,
        footer_description TEXT DEFAULT NULL,
        copyright_text VARCHAR(255) DEFAULT NULL,
        primary_cta_label VARCHAR(80) DEFAULT NULL,
        secondary_cta_label VARCHAR(80) DEFAULT NULL,
        theme_preset VARCHAR(50) NOT NULL DEFAULT 'designbeen',
        primary_color VARCHAR(20) DEFAULT NULL,
        primary_hover_color VARCHAR(20) DEFAULT NULL,
        secondary_color VARCHAR(20) DEFAULT NULL,
        accent_color VARCHAR(20) DEFAULT NULL,
        background_color VARCHAR(20) DEFAULT NULL,
        surface_color VARCHAR(40) DEFAULT NULL,
        text_color VARCHAR(20) DEFAULT NULL,
        active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uniq_site_settings_key (site_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS uploads (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        filename VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        data LONGBLOB NOT NULL,
        size_bytes INT UNSIGNED NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Check and seed default admin user
    const [adminRows] = await query('SELECT id FROM users WHERE email = ? LIMIT 1', ['admin@designbeen.com']);
    if (adminRows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await query(
        'INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, ?, 1)',
        ['DesignBeen Admin', 'admin@designbeen.com', hash, 'admin']
      );
    }

    // 3. Check and seed default site settings
    const [settingRows] = await query('SELECT id FROM site_settings LIMIT 1');
    if (settingRows.length === 0) {
      await query(`
        INSERT INTO site_settings
          (site_key, site_name, site_tagline, email, phone, address, theme_preset, active)
        VALUES
          ('default', 'DesignBeen', 'Premium Design & Engineering Agency', 'contact@designbeen.com', '+1 (555) 019-2834', '100 Innovation Way, San Francisco, CA', 'designbeen', 1)
      `);
    }

    return NextResponse.json({ success: true, message: 'Database setup completed successfully' });
  } catch (error) {
    console.error('Database auto setup failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
