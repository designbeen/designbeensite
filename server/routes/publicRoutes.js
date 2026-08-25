const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validate');
const publicController = require('../controllers/publicController');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/settings', publicController.getSettings);
router.get('/navigation', publicController.getNavigation);
router.get('/hero/:page', publicController.getHero);
router.get('/methodology', publicController.getMethodology);
router.get('/services', publicController.getServices);
router.get('/services/:slug', publicController.getServiceBySlug);
router.get('/projects', publicController.getProjects);
router.get('/projects/:slug', publicController.getProjectBySlug);
router.get('/technologies', publicController.getTechnologies);
router.get('/testimonials', publicController.getTestimonials);
router.get('/partners', publicController.getPartners);
router.get('/team', publicController.getTeam);
router.get('/team-departments', publicController.getTeamDepartments);
router.post(
  '/contact',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('A valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    validate,
  ],
  publicController.postContact,
);

module.exports = router;
