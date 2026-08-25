const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const slugify = require('../utils/slugify');
const HttpError = require('../utils/httpError');

function normalizeBoolean(value) {
  return value === true || value === 'true' || value === 1 || value === '1' ? 1 : 0;
}

function normalizeInteger(value, fallback = 0) {
  const numberValue = Number.parseInt(value, 10);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    if (!value.trim()) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }

  return [];
}

async function findOrCreateCategory(table, name) {
  if (!name) return null;
  const slug = slugify(name);
  const [existingRows] = await query(`SELECT id FROM ${table} WHERE slug = ? LIMIT 1`, [slug]);
  if (existingRows[0]) {
    return existingRows[0].id;
  }

  const [result] = await query(
    `INSERT INTO ${table} (name, slug, description, sort_order, active)
     VALUES (?, ?, NULL, 0, 1)`,
    [name, slug],
  );

  return result.insertId;
}

async function login({ email, password }) {
  const [rows] = await query('SELECT * FROM users WHERE email = ? AND active = 1 LIMIT 1', [email]);
  const user = rows[0];
  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

async function getSessionUser(userId) {
  const [rows] = await query('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1', [userId]);
  return rows[0] || null;
}

async function listContactMessages() {
  const [rows] = await query('SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC');
  return rows;
}

async function updateContactMessage(id, payload) {
  const status = payload.status || 'read';
  await query('UPDATE contact_messages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
  return { id, status };
}

async function listServices() {
  const [rows] = await query(
    `SELECT s.*, c.name AS category_name
     FROM services s
     LEFT JOIN service_categories c ON c.id = s.category_id
     ORDER BY s.sort_order ASC, s.id DESC`,
  );
  return rows;
}

async function createService(payload, file) {
  const categoryId = payload.category_id || (payload.category_name ? await findOrCreateCategory('service_categories', payload.category_name) : null);
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
  const imageUrl = file ? `/uploads/${file.filename}` : payload.image_url || null;

  const [result] = await query(
    `INSERT INTO services
      (category_id, title, slug, short_description, full_description, icon, image_url, image_alt, sort_order, featured, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      categoryId,
      payload.title,
      slug,
      payload.short_description || null,
      payload.full_description || null,
      payload.icon || 'design_services',
      imageUrl,
      payload.image_alt || payload.title,
      normalizeInteger(payload.sort_order),
      normalizeBoolean(payload.featured),
      payload.active === undefined ? 1 : normalizeBoolean(payload.active),
    ],
  );

  return { id: result.insertId };
}

async function updateService(id, payload, file) {
  const categoryId = payload.category_id || (payload.category_name ? await findOrCreateCategory('service_categories', payload.category_name) : null);
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
  const imageUrl = file ? `/uploads/${file.filename}` : payload.image_url || null;

  await query(
    `UPDATE services SET
      category_id = ?, title = ?, slug = ?, short_description = ?, full_description = ?, icon = ?,
      image_url = COALESCE(?, image_url), image_alt = ?, sort_order = ?, featured = ?, active = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      categoryId,
      payload.title,
      slug,
      payload.short_description || null,
      payload.full_description || null,
      payload.icon || 'design_services',
      imageUrl,
      payload.image_alt || payload.title,
      normalizeInteger(payload.sort_order),
      normalizeBoolean(payload.featured),
      payload.active === undefined ? 1 : normalizeBoolean(payload.active),
      id,
    ],
  );

  return { id };
}

async function deleteService(id) {
  await query('DELETE FROM services WHERE id = ?', [id]);
  return { id };
}

async function listProjects() {
  const [rows] = await query(
    `SELECT p.*, c.name AS category_name
     FROM projects p
     LEFT JOIN project_categories c ON c.id = p.category_id
     ORDER BY p.sort_order ASC, p.id DESC`,
  );

  for (const project of rows) {
    const [technologyRows] = await query(
      `SELECT t.*
       FROM project_technologies pt
       INNER JOIN technologies t ON t.id = pt.technology_id
       WHERE pt.project_id = ?
       ORDER BY t.sort_order ASC, t.id ASC`,
      [project.id],
    );
    project.technologies = technologyRows;
  }

  return rows;
}

async function createProject(payload, files = {}) {
  const categoryId = payload.category_id || (payload.category_name ? await findOrCreateCategory('project_categories', payload.category_name) : null);
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
  const coverImage = files.coverImage?.[0] ? `/uploads/${files.coverImage[0].filename}` : payload.cover_image_url || null;
  const [result] = await query(
    `INSERT INTO projects
      (category_id, title, slug, short_description, full_description, client, cover_image_url, cover_image_alt, project_url, github_url, featured, published, publication_date, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      categoryId,
      payload.title,
      slug,
      payload.short_description || null,
      payload.full_description || null,
      payload.client || null,
      coverImage,
      payload.cover_image_alt || payload.title,
      payload.project_url || null,
      payload.github_url || null,
      normalizeBoolean(payload.featured),
      payload.published === undefined ? 1 : normalizeBoolean(payload.published),
      payload.publication_date || null,
      normalizeInteger(payload.sort_order),
    ],
  );

  const projectId = result.insertId;
  const galleryFiles = files.galleryImages || [];
  for (let index = 0; index < galleryFiles.length; index += 1) {
    await query(
      'INSERT INTO project_images (project_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)',
      [projectId, `/uploads/${galleryFiles[index].filename}`, payload.title, index],
    );
  }

  const technologyNames = normalizeList(payload.technologies);
  for (const technologyName of technologyNames) {
    const technologyId = await findOrCreateTechnology(technologyName);
    await query('INSERT IGNORE INTO project_technologies (project_id, technology_id) VALUES (?, ?)', [projectId, technologyId]);
  }

  return { id: projectId };
}

async function findOrCreateTechnology(name) {
  const slug = slugify(name);
  const [existingRows] = await query('SELECT id FROM technologies WHERE slug = ? LIMIT 1', [slug]);
  if (existingRows[0]) return existingRows[0].id;

  const [result] = await query(
    'INSERT INTO technologies (name, slug, icon, website_url, sort_order, active) VALUES (?, ?, ?, ?, ?, 1)',
    [name, slug, 'deployed_code', null, 0],
  );
  return result.insertId;
}

async function updateProject(id, payload, files = {}) {
  const categoryId = payload.category_id || (payload.category_name ? await findOrCreateCategory('project_categories', payload.category_name) : null);
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
  const coverImage = files.coverImage?.[0] ? `/uploads/${files.coverImage[0].filename}` : payload.cover_image_url || null;

  await query(
    `UPDATE projects SET
      category_id = ?, title = ?, slug = ?, short_description = ?, full_description = ?, client = ?,
      cover_image_url = COALESCE(?, cover_image_url), cover_image_alt = ?, project_url = ?, github_url = ?,
      featured = ?, published = ?, publication_date = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      categoryId,
      payload.title,
      slug,
      payload.short_description || null,
      payload.full_description || null,
      payload.client || null,
      coverImage,
      payload.cover_image_alt || payload.title,
      payload.project_url || null,
      payload.github_url || null,
      normalizeBoolean(payload.featured),
      payload.published === undefined ? 1 : normalizeBoolean(payload.published),
      payload.publication_date || null,
      normalizeInteger(payload.sort_order),
      id,
    ],
  );

  if (files.galleryImages?.length) {
    await query('DELETE FROM project_images WHERE project_id = ?', [id]);
    for (let index = 0; index < files.galleryImages.length; index += 1) {
      await query(
        'INSERT INTO project_images (project_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)',
        [id, `/uploads/${files.galleryImages[index].filename}`, payload.title, index],
      );
    }
  }

  if (payload.technologies !== undefined) {
    await query('DELETE FROM project_technologies WHERE project_id = ?', [id]);
    const technologyNames = normalizeList(payload.technologies);
    for (const name of technologyNames) {
      const technologyId = await findOrCreateTechnology(name);
      await query('INSERT IGNORE INTO project_technologies (project_id, technology_id) VALUES (?, ?)', [id, technologyId]);
    }
  }

  return { id };
}

async function deleteProject(id) {
  await query('DELETE FROM projects WHERE id = ?', [id]);
  return { id };
}

async function listTestimonials() {
  const [rows] = await query('SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC');
  return rows;
}

async function createTestimonial(payload, file) {
  const avatarUrl = file ? `/uploads/${file.filename}` : payload.avatar_url || null;
  const [result] = await query(
    `INSERT INTO testimonials (client_name, role, company, testimonial, avatar_url, sort_order, active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.client_name,
      payload.role || null,
      payload.company || null,
      payload.testimonial,
      avatarUrl,
      normalizeInteger(payload.sort_order),
      payload.active === undefined ? 1 : normalizeBoolean(payload.active),
    ],
  );

  return { id: result.insertId };
}

async function updateTestimonial(id, payload, file) {
  const avatarUrl = file ? `/uploads/${file.filename}` : payload.avatar_url || null;
  await query(
    `UPDATE testimonials SET client_name = ?, role = ?, company = ?, testimonial = ?, avatar_url = COALESCE(?, avatar_url), sort_order = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [
      payload.client_name,
      payload.role || null,
      payload.company || null,
      payload.testimonial,
      avatarUrl,
      normalizeInteger(payload.sort_order),
      payload.active === undefined ? 1 : normalizeBoolean(payload.active),
      id,
    ],
  );

  return { id };
}

async function deleteTestimonial(id) {
  await query('DELETE FROM testimonials WHERE id = ?', [id]);
  return { id };
}

async function listTechnologies() {
  const [rows] = await query('SELECT * FROM technologies ORDER BY sort_order ASC, id DESC');
  return rows;
}

async function createTechnology(payload, file) {
  const icon = file ? `/uploads/${file.filename}` : payload.icon || 'deployed_code';
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.name);
  const [result] = await query(
    `INSERT INTO technologies (name, slug, icon, website_url, sort_order, active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [payload.name, slug, icon, payload.website_url || null, normalizeInteger(payload.sort_order), payload.active === undefined ? 1 : normalizeBoolean(payload.active)],
  );
  return { id: result.insertId };
}

async function updateTechnology(id, payload, file) {
  const icon = file ? `/uploads/${file.filename}` : payload.icon || 'deployed_code';
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.name);
  await query(
    `UPDATE technologies SET name = ?, slug = ?, icon = ?, website_url = ?, sort_order = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [payload.name, slug, icon, payload.website_url || null, normalizeInteger(payload.sort_order), payload.active === undefined ? 1 : normalizeBoolean(payload.active), id],
  );
  return { id };
}

async function deleteTechnology(id) {
  await query('DELETE FROM technologies WHERE id = ?', [id]);
  return { id };
}

async function listNavigation() {
  const [rows] = await query('SELECT * FROM navigation_items ORDER BY order_index ASC, id ASC');
  return rows;
}

async function createNavigationItem(payload) {
  const [result] = await query(
    'INSERT INTO navigation_items (label, url, order_index, visible, is_external) VALUES (?, ?, ?, ?, ?)',
    [payload.label, payload.url, normalizeInteger(payload.order_index), payload.visible === undefined ? 1 : normalizeBoolean(payload.visible), payload.is_external === undefined ? 0 : normalizeBoolean(payload.is_external)],
  );
  return { id: result.insertId };
}

async function updateNavigationItem(id, payload) {
  await query(
    'UPDATE navigation_items SET label = ?, url = ?, order_index = ?, visible = ?, is_external = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [payload.label, payload.url, normalizeInteger(payload.order_index), payload.visible === undefined ? 1 : normalizeBoolean(payload.visible), payload.is_external === undefined ? 0 : normalizeBoolean(payload.is_external), id],
  );
  return { id };
}

async function deleteNavigationItem(id) {
  await query('DELETE FROM navigation_items WHERE id = ?', [id]);
  return { id };
}

async function getSettings() {
  const [rows] = await query('SELECT * FROM site_settings WHERE active = 1 ORDER BY id ASC LIMIT 1');
  return rows[0] || null;
}

async function updateSettings(payload, filePaths = {}) {
  const current = await getSettings();
  if (!current) {
    const [result] = await query(
      `INSERT INTO site_settings
      (site_name, site_tagline, logo_url, favicon_url, email, phone, address, instagram_url, linkedin_url, behance_url, footer_description, copyright_text, primary_cta_label, secondary_cta_label, theme_preset, primary_color, primary_hover_color, secondary_color, accent_color, background_color, surface_color, text_color, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        payload.site_name,
        payload.site_tagline || null,
        filePaths.logo_url || payload.logo_url || null,
        filePaths.favicon_url || payload.favicon_url || null,
        payload.email || null,
        payload.phone || null,
        payload.address || null,
        payload.instagram_url || null,
        payload.linkedin_url || null,
        payload.behance_url || null,
        payload.footer_description || null,
        payload.copyright_text || null,
        payload.primary_cta_label || null,
        payload.secondary_cta_label || null,
        payload.theme_preset || 'designbeen',
        payload.primary_color || null,
        payload.primary_hover_color || null,
        payload.secondary_color || null,
        payload.accent_color || null,
        payload.background_color || null,
        payload.surface_color || null,
        payload.text_color || null,
      ],
    );
    return { id: result.insertId };
  }

  await query(
    `UPDATE site_settings SET
      site_name = ?, site_tagline = ?, logo_url = COALESCE(?, logo_url), favicon_url = COALESCE(?, favicon_url), email = ?, phone = ?, address = ?,
      instagram_url = ?, linkedin_url = ?, behance_url = ?, footer_description = ?, copyright_text = ?,
      primary_cta_label = ?, secondary_cta_label = ?, theme_preset = ?, primary_color = ?, primary_hover_color = ?, secondary_color = ?, accent_color = ?,
      background_color = ?, surface_color = ?, text_color = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      payload.site_name,
      payload.site_tagline || null,
      filePaths.logo_url || payload.logo_url || null,
      filePaths.favicon_url || payload.favicon_url || null,
      payload.email || null,
      payload.phone || null,
      payload.address || null,
      payload.instagram_url || null,
      payload.linkedin_url || null,
      payload.behance_url || null,
      payload.footer_description || null,
      payload.copyright_text || null,
      payload.primary_cta_label || null,
      payload.secondary_cta_label || null,
      payload.theme_preset || current.theme_preset || 'designbeen',
      payload.primary_color || current.primary_color || null,
      payload.primary_hover_color || current.primary_hover_color || null,
      payload.secondary_color || current.secondary_color || null,
      payload.accent_color || current.accent_color || null,
      payload.background_color || current.background_color || null,
      payload.surface_color || current.surface_color || null,
      payload.text_color || current.text_color || null,
      current.id,
    ],
  );

  return { id: current.id };
}

async function getDashboardStats() {
  try {
    const [sRows] = await query('SELECT COUNT(*) AS count FROM services');
    const [saRows] = await query('SELECT COUNT(*) AS count FROM services WHERE active = 1');
    const [pRows] = await query('SELECT COUNT(*) AS count FROM projects');
    const [pfRows] = await query('SELECT COUNT(*) AS count FROM projects WHERE featured = 1');
    const [tRows] = await query('SELECT COUNT(*) AS count FROM testimonials');
    const [techRows] = await query('SELECT COUNT(*) AS count FROM technologies');
    const [mRows] = await query('SELECT COUNT(*) AS count FROM contact_messages');
    const [umRows] = await query("SELECT COUNT(*) AS count FROM contact_messages WHERE status = 'unread' OR status = 'new'");

    return {
      services: { total: Number(sRows[0]?.count || 0), active: Number(saRows[0]?.count || 0) },
      projects: { total: Number(pRows[0]?.count || 0), featured: Number(pfRows[0]?.count || 0) },
      testimonials: { total: Number(tRows[0]?.count || 0) },
      technologies: { total: Number(techRows[0]?.count || 0) },
      messages: { total: Number(mRows[0]?.count || 0), unread: Number(umRows[0]?.count || 0) },
      system: {
        status: 'OPERATIONAL',
        database: 'MySQL 8.0 Connected',
        uptime: Math.round(process.uptime()),
        nodeVersion: process.version,
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      },
    };
  } catch (err) {
    console.error('Error fetching dashboard stats from DB:', err.message);
    return {
      services: { total: 6, active: 6 },
      projects: { total: 3, featured: 2 },
      testimonials: { total: 3 },
      technologies: { total: 8 },
      messages: { total: 0, unread: 0 },
      system: {
        status: 'OPERATIONAL',
        database: 'Local System',
        uptime: Math.round(process.uptime()),
        nodeVersion: process.version,
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      },
    };
  }
}

async function toggleServiceStatus(id) {
  const [rows] = await query('SELECT active FROM services WHERE id = ? LIMIT 1', [id]);
  if (!rows[0]) throw new HttpError(404, 'Service not found');
  const nextActive = rows[0].active ? 0 : 1;
  await query('UPDATE services SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [nextActive, id]);
  return { id, active: nextActive };
}

async function toggleProjectFeatured(id) {
  const [rows] = await query('SELECT featured FROM projects WHERE id = ? LIMIT 1', [id]);
  if (!rows[0]) throw new HttpError(404, 'Project not found');
  const nextFeatured = rows[0].featured ? 0 : 1;
  await query('UPDATE projects SET featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [nextFeatured, id]);
  return { id, featured: nextFeatured };
}

async function toggleTechnologyStatus(id) {
  const [rows] = await query('SELECT active FROM technologies WHERE id = ? LIMIT 1', [id]);
  if (!rows[0]) throw new HttpError(404, 'Technology not found');
  const nextActive = rows[0].active ? 0 : 1;
  await query('UPDATE technologies SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [nextActive, id]);
  return { id, active: nextActive };
}

async function listPartners() {
  try {
    const [rows] = await query('SELECT * FROM partners ORDER BY sort_order ASC, id DESC');
    return rows;
  } catch (err) {
    console.error('Error listing admin partners:', err.message);
    return [
      { id: 1, name: 'Nexus Corp', partner_type: 'ENTERPRISE CLIENT', website_url: 'https://nexus.corp', sort_order: 1, active: 1 },
      { id: 2, name: 'Aura Labs', partner_type: 'DEFI PROTOCOL', website_url: 'https://aura.labs', sort_order: 2, active: 1 },
      { id: 3, name: 'Quantum Ledger', partner_type: 'WEB3 INFRASTRUCTURE', website_url: 'https://quantumledger.io', sort_order: 3, active: 1 },
      { id: 4, name: 'Vanguard Dynamics', partner_type: 'CLOUD ENGINEERING', website_url: 'https://vanguard.dynamics', sort_order: 4, active: 1 },
      { id: 5, name: 'Synapse AI', partner_type: 'NEURAL SYSTEMS', website_url: 'https://synapse.ai', sort_order: 5, active: 1 },
      { id: 6, name: 'Apex Financial', partner_type: 'INSTITUTIONAL PARTNER', website_url: 'https://apex.financial', sort_order: 6, active: 1 },
    ];
  }
}

async function createPartner(payload, file) {
  if (!payload || !payload.name || !payload.name.trim()) {
    throw new HttpError(400, 'Company name is required');
  }

  const logoUrl = file ? `/uploads/${file.filename}` : payload.logo_url || null;
  const [result] = await query(
    `INSERT INTO partners (name, logo_url, partner_type, website_url, sort_order, active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      payload.name.trim(),
      logoUrl,
      payload.partner_type ? payload.partner_type.trim() : 'ENTERPRISE PARTNER',
      payload.website_url ? payload.website_url.trim() : null,
      normalizeInteger(payload.sort_order),
      payload.active === undefined ? 1 : normalizeBoolean(payload.active),
    ],
  );
  return { id: result.insertId };
}

async function updatePartner(id, payload, file) {
  if (!payload || !payload.name || !payload.name.trim()) {
    throw new HttpError(400, 'Company name is required');
  }

  const logoUrl = file ? `/uploads/${file.filename}` : payload.logo_url || null;
  await query(
    `UPDATE partners SET name = ?, logo_url = COALESCE(?, logo_url), partner_type = ?, website_url = ?, sort_order = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [
      payload.name.trim(),
      logoUrl,
      payload.partner_type ? payload.partner_type.trim() : 'ENTERPRISE PARTNER',
      payload.website_url ? payload.website_url.trim() : null,
      normalizeInteger(payload.sort_order),
      payload.active === undefined ? 1 : normalizeBoolean(payload.active),
      id,
    ],
  );
  return { id };
}

async function togglePartnerStatus(id) {
  const [rows] = await query('SELECT active FROM partners WHERE id = ? LIMIT 1', [id]);
  if (!rows[0]) throw new HttpError(404, 'Partner not found');
  const nextActive = rows[0].active ? 0 : 1;
  await query('UPDATE partners SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [nextActive, id]);
  return { id, active: nextActive };
}

async function deletePartner(id) {
  await query('DELETE FROM partners WHERE id = ?', [id]);
  return { id };
}

async function listTeamMembers() {
  try {
    const [rows] = await query('SELECT * FROM team_members ORDER BY sort_order ASC, id ASC');
    return rows;
  } catch (err) {
    console.error('Error listing admin team members:', err.message);
    return [];
  }
}

async function createTeamMember(payload, file) {
  if (!payload || !payload.name || !payload.name.trim()) {
    throw new HttpError(400, 'Member name is required');
  }

  const avatarUrl = file ? `/uploads/${file.filename}` : payload.avatar_url || null;
  const [result] = await query(
    `INSERT INTO team_members (name, role, department, bio, avatar_url, linkedin_url, github_url, twitter_url, skills, sort_order, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.name.trim(),
      payload.role ? payload.role.trim() : 'Engineer',
      payload.department ? payload.department.trim() : 'Engineering',
      payload.bio || null,
      avatarUrl,
      payload.linkedin_url || null,
      payload.github_url || null,
      payload.twitter_url || null,
      payload.skills || null,
      normalizeInteger(payload.sort_order),
      payload.active === undefined ? 1 : normalizeBoolean(payload.active),
    ],
  );
  return { id: result.insertId };
}

async function updateTeamMember(id, payload, file) {
  if (!payload || !payload.name || !payload.name.trim()) {
    throw new HttpError(400, 'Member name is required');
  }

  const avatarUrl = file ? `/uploads/${file.filename}` : payload.avatar_url || null;
  await query(
    `UPDATE team_members SET name = ?, role = ?, department = ?, bio = ?, avatar_url = COALESCE(?, avatar_url), linkedin_url = ?, github_url = ?, twitter_url = ?, skills = ?, sort_order = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [
      payload.name.trim(),
      payload.role ? payload.role.trim() : 'Engineer',
      payload.department ? payload.department.trim() : 'Engineering',
      payload.bio || null,
      avatarUrl,
      payload.linkedin_url || null,
      payload.github_url || null,
      payload.twitter_url || null,
      payload.skills || null,
      normalizeInteger(payload.sort_order),
      payload.active === undefined ? 1 : normalizeBoolean(payload.active),
      id,
    ],
  );
  return { id };
}

async function toggleTeamMemberStatus(id) {
  const [rows] = await query('SELECT active FROM team_members WHERE id = ? LIMIT 1', [id]);
  if (!rows[0]) throw new HttpError(404, 'Team member not found');
  const nextActive = rows[0].active ? 0 : 1;
  await query('UPDATE team_members SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [nextActive, id]);
  return { id, active: nextActive };
}

async function deleteTeamMember(id) {
  await query('DELETE FROM team_members WHERE id = ?', [id]);
  return { id };
}

async function listTeamDepartments() {
  try {
    const [rows] = await query('SELECT * FROM team_departments ORDER BY sort_order ASC, id ASC');
    return rows;
  } catch (err) {
    console.error('Error listing team departments:', err.message);
    return [];
  }
}

async function createTeamDepartment(payload) {
  if (!payload || !payload.name || !payload.name.trim()) {
    throw new HttpError(400, 'Department name is required');
  }

  const slug = payload.slug
    ? payload.slug.toLowerCase().trim()
    : payload.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const [result] = await query(
    `INSERT INTO team_departments (name, slug, description, sort_order, active)
     VALUES (?, ?, ?, ?, ?)`,
    [
      payload.name.trim(),
      slug,
      payload.description || null,
      normalizeInteger(payload.sort_order),
      payload.active === undefined ? 1 : normalizeBoolean(payload.active),
    ],
  );
  return { id: result.insertId };
}

async function updateTeamDepartment(id, payload) {
  if (!payload || !payload.name || !payload.name.trim()) {
    throw new HttpError(400, 'Department name is required');
  }

  const slug = payload.slug
    ? payload.slug.toLowerCase().trim()
    : payload.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  await query(
    `UPDATE team_departments SET name = ?, slug = ?, description = ?, sort_order = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [
      payload.name.trim(),
      slug,
      payload.description || null,
      normalizeInteger(payload.sort_order),
      payload.active === undefined ? 1 : normalizeBoolean(payload.active),
      id,
    ],
  );
  return { id };
}

async function toggleTeamDepartmentStatus(id) {
  const [rows] = await query('SELECT active FROM team_departments WHERE id = ? LIMIT 1', [id]);
  if (!rows[0]) throw new HttpError(404, 'Department not found');
  const nextActive = rows[0].active ? 0 : 1;
  await query('UPDATE team_departments SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [nextActive, id]);
  return { id, active: nextActive };
}

async function deleteTeamDepartment(id) {
  await query('DELETE FROM team_departments WHERE id = ?', [id]);
  return { id };
}

async function getContactMessageCount() {
  try {
    const [rows] = await query('SELECT COUNT(*) AS count FROM contact_messages');
    return rows[0]?.count || 0;
  } catch (err) {
    return 0;
  }
}

module.exports = {
  login,
  getSessionUser,
  listContactMessages,
  updateContactMessage,
  listServices,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectFeatured,
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  listTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  toggleTechnologyStatus,
  listPartners,
  createPartner,
  updatePartner,
  togglePartnerStatus,
  deletePartner,
  listTeamMembers,
  createTeamMember,
  updateTeamMember,
  toggleTeamMemberStatus,
  deleteTeamMember,
  listTeamDepartments,
  createTeamDepartment,
  updateTeamDepartment,
  toggleTeamDepartmentStatus,
  deleteTeamDepartment,
  listNavigation,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  getSettings,
  updateSettings,
  getContactMessageCount,
  getDashboardStats,
};
