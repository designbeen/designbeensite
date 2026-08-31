SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE project_technologies;
TRUNCATE TABLE project_images;
TRUNCATE TABLE projects;
TRUNCATE TABLE project_categories;
TRUNCATE TABLE services;
TRUNCATE TABLE service_categories;
TRUNCATE TABLE technologies;
TRUNCATE TABLE testimonials;
TRUNCATE TABLE partners;
TRUNCATE TABLE team_members;
TRUNCATE TABLE team_departments;
TRUNCATE TABLE methodology_steps;
TRUNCATE TABLE navigation_items;
TRUNCATE TABLE hero_sections;
TRUNCATE TABLE site_settings;
TRUNCATE TABLE contact_messages;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (name, email, password_hash, role, active)
VALUES
  ('DesignBeen Admin', 'admin@designbeen.com', '$2a$10$ut6VPNsVU5.Oc14J6Hhv5.AIXLHLJ9IK6u7TfJIGYJcVQ5p.1tJ0O', 'admin', 1),
  ('DesignBeen Admin', 'admin@designbeen.local', '$2a$10$ut6VPNsVU5.Oc14J6Hhv5.AIXLHLJ9IK6u7TfJIGYJcVQ5p.1tJ0O', 'admin', 1);

INSERT INTO site_settings (
  site_key, site_name, site_tagline, logo_url, favicon_url, email, phone, address,
  instagram_url, linkedin_url, behance_url, footer_description, copyright_text,
  primary_cta_label, secondary_cta_label, theme_preset, primary_color, primary_hover_color, secondary_color, accent_color, background_color, surface_color, text_color, active
) VALUES (
  'default',
  'DesignBeen',
  'Engineering Future Realities',
  '/assets/logo-mark.svg',
  '/assets/favicon.svg',
  'hello@designbeen.com',
  '+1 (555) 014-2234',
  '1208 Meridian Ave, San Francisco, CA',
  'https://instagram.com/designbeen',
  'https://linkedin.com/company/designbeen',
  'https://behance.net/designbeen',
  'Engineering Excellence in Design. Crafting the interfaces of tomorrow.',
  '© 2024 DesignBeen. Engineering Future Realities.',
  'Get Started',
  'View Work',
  'designbeen',
  '#4000c1',
  '#5200ec',
  '#00677f',
  '#00ccf9',
  '#f7f9fb',
  'rgba(255,255,255,0.55)',
  '#191c1e',
  1
);

INSERT INTO navigation_items (label, url, order_index, visible, is_external) VALUES
('Home', '/', 1, 1, 0),
('Services', '/services', 2, 1, 0),
('Portfolio', '/portfolio', 3, 1, 0),
('About', '/about', 4, 1, 0),
('Contact', '/contact', 5, 1, 0);

INSERT INTO hero_sections (
  page_key, badge, title, highlighted_text, description, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, image_url, image_alt, background_text, active, sort_order
) VALUES
('home', 'Visionary Interfaces', 'Engineering', 'Excellence in Design.', 'A premium high-tech agency crafting futuristic digital experiences. We blend architectural precision with visionary aesthetics to build the interfaces of tomorrow.', 'Explore Our Work', '/portfolio', 'Start a Project', '/contact', '/assets/home-hero.png', 'DesignBeen hero visual', 'ENGINEERING THE EXCEPTIONAL', 1, 1),
('services', 'Core Competencies', 'Architecting the Future of Digital Experience', 'Future', 'Comprehensive digital engineering for the next era of technology.', 'Start a project', '/contact', 'View portfolio', '/portfolio', '/assets/services-hero.png', 'DesignBeen services visual', 'VISIONARY SOLUTIONS', 1, 1),
('portfolio', 'Portfolio', 'Engineering the Exceptional', 'Exceptional', 'A curated gallery of visionary interfaces and technical masterclasses crafted for global innovators.', 'Start a project', '/contact', 'Explore services', '/services', '/assets/portfolio-hero.png', 'DesignBeen portfolio visual', 'SELECTED CASE STUDIES', 1, 1),
('about', 'About', 'A reusable agency template with a distinct visual identity.', 'Template', 'The DesignBeen UI is now driven by a reusable React, Express, and MySQL architecture.', 'View services', '/services', 'Contact us', '/contact', '/assets/about-hero.png', 'DesignBeen about visual', 'ABOUT DESIGNBEEN', 1, 1),
('contact', 'Contact', 'Ready to build the future?', 'Future', 'Tell us about your project and we will respond through the stored contact workflow.', 'Send message', '/contact', 'View work', '/portfolio', '/assets/contact-hero.png', 'DesignBeen contact visual', 'LET US CONNECT', 1, 1);

INSERT INTO service_categories (name, slug, description, sort_order, active) VALUES
('Architecture', 'architecture', 'Systems and infrastructure planning.', 1, 1),
('Experience Design', 'experience-design', 'User interface and interaction design.', 2, 1),
('Emerging Tech', 'emerging-tech', 'AI, blockchain, cloud, and analytics.', 3, 1);

INSERT INTO services (category_id, title, slug, short_description, full_description, icon, image_url, image_alt, sort_order, featured, active) VALUES
(1, 'System Architecture', 'system-architecture', 'High-performance, scalable infrastructures designed for the next generation of web applications.', 'Scalable systems, clean data flows, and resilient infrastructure patterns for high-growth products.', 'dns', '/assets/service-architecture.png', 'System architecture visual', 1, 1, 1),
(2, 'UI/UX Design', 'ui-ux-design', 'Visionary interfaces blending fluid glassmorphism with highly intuitive, user-centric journeys.', 'Editorial-grade UI and UX systems that preserve the DesignBeen visual identity across devices.', 'design_services', '/assets/service-uiux.png', 'UI/UX design visual', 2, 1, 1),
(3, 'AI Solutions', 'ai-solutions', 'Intelligent system integrations leveraging cutting-edge machine learning algorithms to automate and enhance.', 'Machine learning-driven product features, intelligent automations, and decision support layers.', 'smart_toy', '/assets/service-ai.png', 'AI solutions visual', 3, 1, 1),
(3, 'Blockchain Integration', 'blockchain-integration', 'Secure, decentralized solutions tailored for the evolving Web3 ecosystem, ensuring transparency and trust.', 'Smart contract interfaces and Web3 integrations that keep the product understandable and secure.', 'link', '/assets/service-blockchain.png', 'Blockchain integration visual', 4, 1, 1),
(1, 'Cloud Infrastructure', 'cloud-infrastructure', 'Resilient and adaptive cloud environments providing global reach and unparalleled uptime.', 'Cloud architectures that are scalable, observable, and ready for high-availability production workflows.', 'cloud', '/assets/service-cloud.png', 'Cloud infrastructure visual', 5, 1, 1),
(3, 'Data Analytics', 'data-analytics', 'Deep-dive predictive analytics transforming raw data into actionable, strategic insights.', 'Analytics dashboards and pipelines that turn complex datasets into actionable product intelligence.', 'analytics', '/assets/service-analytics.png', 'Data analytics visual', 6, 1, 1);

INSERT INTO project_categories (name, slug, description, sort_order, active) VALUES
('AI Solutions', 'ai-solutions', 'AI dashboards and product intelligence.', 1, 1),
('Blockchain Integration', 'blockchain-integration', 'Web3, DeFi, and distributed product systems.', 2, 1),
('Product Strategy', 'product-strategy', 'Editorial product storytelling and UX direction.', 3, 1);

INSERT INTO technologies (name, slug, icon, website_url, sort_order, active) VALUES
('TypeScript', 'typescript', 'code', 'https://www.typescriptlang.org/', 1, 1),
('React.js', 'react-js', 'api', 'https://react.dev/', 2, 1),
('Tailwind CSS', 'tailwind-css', 'view_quilt', 'https://tailwindcss.com/', 3, 1),
('Framer Motion', 'framer-motion', 'motion_photos_on', 'https://www.framer.com/motion/', 4, 1),
('Node.js', 'node-js', 'terminal', 'https://nodejs.org/', 5, 1),
('Express.js', 'express-js', 'deployed_code', 'https://expressjs.com/', 6, 1),
('MySQL', 'mysql', 'database', 'https://www.mysql.com/', 7, 1),
('Three.js', 'three-js', 'view_in_ar', 'https://threejs.org/', 8, 1),
('Next.js', 'next-js', 'web', 'https://nextjs.org/', 9, 1),
('Vue.js', 'vue-js', 'widgets', 'https://vuejs.org/', 10, 1);

INSERT INTO projects (
  category_id, title, slug, short_description, full_description, client, cover_image_url, cover_image_alt, project_url, github_url, featured, published, publication_date, sort_order
) VALUES
(1, 'Nexus AI Dashboard', 'nexus-ai-dashboard', 'An intuitive, predictive analytics platform designed to simplify complex data architectures for enterprise decision-makers.', 'A predictive intelligence platform focused on dense enterprise data flows, glassmorphism analytics, and rapid insight generation.', 'Nexus Corp', '/assets/project-nexus.png', 'Nexus AI Dashboard preview', 'https://nexus.example.com', 'https://github.com/designbeen/nexus-ai-dashboard', 1, 1, '2024-07-16', 1),
(2, 'Aura DeFi Protocol', 'aura-defi-protocol', 'A high-security decentralized finance interface that bridges institutional trust with Web3 transparency.', 'A clean decentralized finance experience with a layered trust model, highly legible content, and secure transaction flows.', 'Aura Labs', '/assets/project-aura.png', 'Aura DeFi Protocol preview', 'https://aura.example.com', 'https://github.com/designbeen/aura-defi-protocol', 1, 1, '2024-08-01', 2);

INSERT INTO project_images (project_id, image_url, alt_text, sort_order) VALUES
(1, '/assets/project-nexus-detail-1.png', 'Nexus AI Dashboard detail image 1', 1),
(1, '/assets/project-nexus-detail-2.png', 'Nexus AI Dashboard detail image 2', 2),
(2, '/assets/project-aura-detail-1.png', 'Aura DeFi Protocol detail image 1', 1),
(2, '/assets/project-aura-detail-2.png', 'Aura DeFi Protocol detail image 2', 2);

INSERT INTO project_technologies (project_id, technology_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 6), (1, 7),
(2, 1), (2, 2), (2, 3), (2, 6), (2, 7), (2, 8);

INSERT INTO testimonials (client_name, role, company, testimonial, avatar_url, sort_order, active) VALUES
('Sarah Jenkins', 'CTO', 'Nexus Corp', 'DesignBeen redefined our platform''s architecture. Their blend of aesthetic precision and backend scalability is unmatched in the industry.', '/assets/testimonial-sarah.png', 1, 1),
('Marcus Thorne', 'Lead Product', 'Aura.AI', 'The visionary liquid interfaces they designed for our AI dashboard completely transformed our user engagement metrics overnight.', '/assets/testimonial-marcus.png', 2, 1),
('Elena Rostova', 'Founder', 'Quantum Ledger', 'Their approach to Web3 integration was flawless. They built a seamless, intuitive layer over complex smart contract logic.', '/assets/testimonial-elena.png', 3, 1);

INSERT INTO partners (name, logo_url, partner_type, website_url, sort_order, active) VALUES
('Nexus Corp', '/assets/project-nexus.png', 'ENTERPRISE CLIENT', 'https://nexus.corp', 1, 1),
('Aura Labs', '/assets/project-aura.png', 'DEFI PROTOCOL', 'https://aura.labs', 2, 1),
('Quantum Ledger', '/assets/project-vanguard.png', 'WEB3 INFRASTRUCTURE', 'https://quantumledger.io', 3, 1),
('Vanguard Dynamics', NULL, 'CLOUD ENGINEERING', 'https://vanguard.dynamics', 4, 1),
('Synapse AI', NULL, 'NEURAL SYSTEMS', 'https://synapse.ai', 5, 1),
('Apex Financial', NULL, 'INSTITUTIONAL PARTNER', 'https://apex.financial', 6, 1);

INSERT INTO team_members (name, role, department, bio, avatar_url, linkedin_url, github_url, twitter_url, skills, sort_order, active) VALUES
('Alexander Vance', 'Chief Technology Officer', 'Engineering', 'Ex-Google principal systems architect specializing in high-throughput distributed infrastructure and zero-latency real-time protocols.', '/assets/testimonial-sarah.png', 'https://linkedin.com/in/alexandervance', 'https://github.com/alexvance', 'https://twitter.com/alexvance', 'Distributed Systems, Rust, Node.js, Cloud', 1, 1),
('Elena Rostova', 'Chief Design Officer', 'Design', 'Visionary UI/UX director pioneer of liquid glassmorphism, procedural animations, and human-computer interactions.', '/assets/testimonial-elena.png', 'https://linkedin.com/in/elenarostova', 'https://github.com/elenarostova', 'https://twitter.com/elenarostova', 'Glassmorphism, Motion, Figma, Design Systems', 2, 1),
('Dr. Marcus Thorne', 'Head of AI & Intelligence', 'AI & Research', 'PhD in Applied Machine Learning from MIT, leading neural network integration and predictive intelligence architectures.', '/assets/testimonial-marcus.png', 'https://linkedin.com/in/marcusthorne', 'https://github.com/marcusthorne', 'https://twitter.com/marcusthorne', 'PyTorch, Neural Networks, LLMs, Computer Vision', 3, 1),
('Sophia Chen', 'Principal Systems Engineer', 'Engineering', 'Full-stack performance specialist focusing on React micro-frontends, WebGL canvas shaders, and sub-millisecond database queries.', NULL, 'https://linkedin.com/in/sophiachen', 'https://github.com/sophiachen', 'https://twitter.com/sophiachen', 'React, TypeScript, Three.js, MySQL', 4, 1);

INSERT INTO team_departments (name, slug, description, sort_order, active) VALUES
('Engineering', 'engineering', 'Systems, backend infrastructure, and cloud development.', 1, 1),
('Design', 'design', 'UI/UX design, motion systems, and brand direction.', 2, 1),
('AI & Research', 'ai-research', 'Machine learning, predictive models, and research.', 3, 1),
('Product Strategy', 'product-strategy', 'Product direction and editorial storytelling.', 4, 1),
('Leadership', 'leadership', 'Executive leadership and agency management.', 5, 1);

INSERT INTO methodology_steps (page_key, step_number, title, description, active, sort_order) VALUES
('home', 1, 'Strategy', 'Research, positioning, and product architecture.', 1, 1),
('home', 2, 'Design', 'Glassmorphism compositions and motion systems.', 1, 2),
('home', 3, 'Engineering', 'React, Express, and API implementation.', 1, 3),
('home', 4, 'Deployment', 'Release, observability, and stabilization.', 1, 4),
('home', 5, 'Growth', 'Iteration based on data and feedback.', 1, 5);

SET FOREIGN_KEY_CHECKS = 1;
