const { query } = require('../config/database');

async function getSettings() {
  const [rows] = await query('SELECT * FROM site_settings WHERE active = 1 ORDER BY id ASC LIMIT 1');
  return rows[0] || null;
}

async function getNavigation() {
  const [rows] = await query('SELECT * FROM navigation_items WHERE visible = 1 ORDER BY order_index ASC, id ASC');
  return rows;
}

async function getHero(pageKey) {
  const [rows] = await query('SELECT * FROM hero_sections WHERE active = 1 AND page_key = ? ORDER BY sort_order ASC, id ASC LIMIT 1', [pageKey]);
  return rows[0] || null;
}

async function getMethodology() {
  const [rows] = await query('SELECT * FROM methodology_steps WHERE active = 1 ORDER BY sort_order ASC, step_number ASC');
  return rows;
}

async function getServices() {
  const [rows] = await query(
    `SELECT s.*, c.name AS category_name, c.slug AS category_slug
     FROM services s
     LEFT JOIN service_categories c ON c.id = s.category_id
     WHERE s.active = 1
     ORDER BY s.sort_order ASC, s.id ASC`,
  );
  return rows;
}

async function getServiceBySlug(slug) {
  const [rows] = await query(
    `SELECT s.*, c.name AS category_name, c.slug AS category_slug
     FROM services s
     LEFT JOIN service_categories c ON c.id = s.category_id
     WHERE s.slug = ?
     LIMIT 1`,
    [slug],
  );
  return rows[0] || null;
}

async function getProjects() {
  const [rows] = await query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM projects p
     LEFT JOIN project_categories c ON c.id = p.category_id
     WHERE p.published = 1
     ORDER BY p.sort_order ASC, p.publication_date DESC, p.id DESC`,
  );
  return rows;
}

async function getProjectBySlug(slug) {
  const [projectRows] = await query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM projects p
     LEFT JOIN project_categories c ON c.id = p.category_id
     WHERE p.slug = ?
     LIMIT 1`,
    [slug],
  );

  const project = projectRows[0] || null;
  if (!project) {
    return null;
  }

  const [imageRows] = await query(
    'SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order ASC, id ASC',
    [project.id],
  );

  const [technologyRows] = await query(
    `SELECT t.*
     FROM project_technologies pt
     INNER JOIN technologies t ON t.id = pt.technology_id
     WHERE pt.project_id = ? AND t.active = 1
     ORDER BY t.sort_order ASC, t.id ASC`,
    [project.id],
  );

  project.gallery = imageRows;
  project.technologies = technologyRows;
  return project;
}

async function getTechnologies() {
  const [rows] = await query('SELECT * FROM technologies WHERE active = 1 ORDER BY sort_order ASC, id ASC');
  return rows;
}

async function getTestimonials() {
  const [rows] = await query('SELECT * FROM testimonials WHERE active = 1 ORDER BY sort_order ASC, id ASC');
  return rows;
}

async function createContactMessage(payload) {
  const [result] = await query(
    `INSERT INTO contact_messages (name, email, subject, message, status, ip_address, user_agent)
     VALUES (?, ?, ?, ?, 'new', ?, ?)`,
    [payload.name, payload.email, payload.subject || null, payload.message, payload.ip_address || null, payload.user_agent || null],
  );

  return { id: result.insertId };
}

async function getPartners() {
  try {
    const [rows] = await query('SELECT * FROM partners WHERE active = 1 ORDER BY sort_order ASC, id DESC');
    if (rows.length) return rows;
  } catch (err) {
    console.error('Error fetching partners:', err.message);
  }

  return [
    { id: 1, name: 'Nexus Corp', partner_type: 'ENTERPRISE CLIENT' },
    { id: 2, name: 'Aura Labs', partner_type: 'DEFI PROTOCOL' },
    { id: 3, name: 'Quantum Ledger', partner_type: 'WEB3 INFRASTRUCTURE' },
    { id: 4, name: 'Vanguard Dynamics', partner_type: 'CLOUD ENGINEERING' },
    { id: 5, name: 'Synapse AI', partner_type: 'NEURAL SYSTEMS' },
    { id: 6, name: 'Apex Financial', partner_type: 'INSTITUTIONAL PARTNER' },
  ];
}

async function getTeam() {
  try {
    const [rows] = await query('SELECT * FROM team_members WHERE active = 1 ORDER BY sort_order ASC, id ASC');
    if (rows.length) return rows;
  } catch (err) {
    console.error('Error fetching team members:', err.message);
  }

  return [
    {
      id: 1,
      name: 'Alexander Vance',
      role: 'Chief Technology Officer',
      department: 'Engineering',
      bio: 'Ex-Google principal systems architect specializing in high-throughput distributed infrastructure and zero-latency real-time protocols.',
      avatar_url: '/assets/testimonial-sarah.png',
      linkedin_url: 'https://linkedin.com/in/alexandervance',
      github_url: 'https://github.com/alexvance',
      twitter_url: 'https://twitter.com/alexvance',
      skills: 'Distributed Systems, Rust, Node.js, Cloud',
    },
    {
      id: 2,
      name: 'Elena Rostova',
      role: 'Chief Design Officer',
      department: 'Design',
      bio: 'Visionary UI/UX director pioneer of liquid glassmorphism, procedural animations, and human-computer interactions.',
      avatar_url: '/assets/testimonial-elena.png',
      linkedin_url: 'https://linkedin.com/in/elenarostova',
      github_url: 'https://github.com/elenarostova',
      twitter_url: 'https://twitter.com/elenarostova',
      skills: 'Glassmorphism, Motion, Figma, Design Systems',
    },
    {
      id: 3,
      name: 'Dr. Marcus Thorne',
      role: 'Head of AI & Intelligence',
      department: 'AI & Research',
      bio: 'PhD in Applied Machine Learning from MIT, leading neural network integration and predictive intelligence architectures.',
      avatar_url: '/assets/testimonial-marcus.png',
      linkedin_url: 'https://linkedin.com/in/marcusthorne',
      github_url: 'https://github.com/marcusthorne',
      twitter_url: 'https://twitter.com/marcusthorne',
      skills: 'PyTorch, Neural Networks, LLMs, Computer Vision',
    },
    {
      id: 4,
      name: 'Sophia Chen',
      role: 'Principal Systems Engineer',
      department: 'Engineering',
      bio: 'Full-stack performance specialist focusing on React micro-frontends, WebGL canvas shaders, and sub-millisecond database queries.',
      avatar_url: null,
      linkedin_url: 'https://linkedin.com/in/sophiachen',
      github_url: 'https://github.com/sophiachen',
      twitter_url: 'https://twitter.com/sophiachen',
      skills: 'React, TypeScript, Three.js, MySQL',
    },
  ];
}

async function getTeamDepartments() {
  try {
    const [rows] = await query('SELECT * FROM team_departments WHERE active = 1 ORDER BY sort_order ASC, id ASC');
    if (rows.length) return rows;
  } catch (err) {
    console.error('Error fetching team departments:', err.message);
  }

  return [
    { id: 1, name: 'Engineering', slug: 'engineering' },
    { id: 2, name: 'Design', slug: 'design' },
    { id: 3, name: 'AI & Research', slug: 'ai-research' },
    { id: 4, name: 'Product Strategy', slug: 'product-strategy' },
    { id: 5, name: 'Leadership', slug: 'leadership' },
  ];
}

module.exports = {
  getSettings,
  getNavigation,
  getHero,
  getMethodology,
  getServices,
  getServiceBySlug,
  getProjects,
  getProjectBySlug,
  getTechnologies,
  getTestimonials,
  getPartners,
  getTeam,
  getTeamDepartments,
  createContactMessage,
};
