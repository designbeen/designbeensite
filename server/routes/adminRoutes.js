const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const adminController = require('../controllers/adminController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, [body('email').isEmail().withMessage('A valid email is required'), body('password').isLength({ min: 8 }).withMessage('Password is required'), validate], adminController.login);
router.post('/logout', requireAuth, adminController.logout);
router.get('/me', requireAuth, adminController.me);

router.get('/stats', requireAuth, adminController.getDashboardStats);

router.get('/contact-messages', requireAuth, adminController.listContactMessages);
router.put('/contact-messages/:id', requireAuth, adminController.updateContactMessage);

router.get('/services', requireAuth, adminController.listServices);
router.post('/services', requireAuth, upload.single('image'), adminController.createService);
router.put('/services/:id', requireAuth, upload.single('image'), adminController.updateService);
router.patch('/services/:id/toggle', requireAuth, adminController.toggleService);
router.delete('/services/:id', requireAuth, adminController.deleteService);

router.get('/projects', requireAuth, adminController.listProjects);
router.post('/projects', requireAuth, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 8 }]), adminController.createProject);
router.put('/projects/:id', requireAuth, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 8 }]), adminController.updateProject);
router.patch('/projects/:id/toggle', requireAuth, adminController.toggleProject);
router.delete('/projects/:id', requireAuth, adminController.deleteProject);

router.get('/testimonials', requireAuth, adminController.listTestimonials);
router.post('/testimonials', requireAuth, upload.single('avatar'), adminController.createTestimonial);
router.put('/testimonials/:id', requireAuth, upload.single('avatar'), adminController.updateTestimonial);
router.delete('/testimonials/:id', requireAuth, adminController.deleteTestimonial);

router.get('/technologies', requireAuth, adminController.listTechnologies);
router.post('/technologies', requireAuth, upload.single('iconFile'), adminController.createTechnology);
router.put('/technologies/:id', requireAuth, upload.single('iconFile'), adminController.updateTechnology);
router.patch('/technologies/:id/toggle', requireAuth, adminController.toggleTechnology);
router.delete('/technologies/:id', requireAuth, adminController.deleteTechnology);

router.get('/partners', requireAuth, adminController.listPartners);
router.post('/partners', requireAuth, upload.single('logoFile'), adminController.createPartner);
router.put('/partners/:id', requireAuth, upload.single('logoFile'), adminController.updatePartner);
router.patch('/partners/:id/toggle', requireAuth, adminController.togglePartner);
router.delete('/partners/:id', requireAuth, adminController.deletePartner);

router.get('/team', requireAuth, adminController.listTeamMembers);
router.post('/team', requireAuth, upload.single('avatarFile'), adminController.createTeamMember);
router.put('/team/:id', requireAuth, upload.single('avatarFile'), adminController.updateTeamMember);
router.patch('/team/:id/toggle', requireAuth, adminController.toggleTeamMember);
router.delete('/team/:id', requireAuth, adminController.deleteTeamMember);

router.get('/team-departments', requireAuth, adminController.listTeamDepartments);
router.post('/team-departments', requireAuth, adminController.createTeamDepartment);
router.put('/team-departments/:id', requireAuth, adminController.updateTeamDepartment);
router.patch('/team-departments/:id/toggle', requireAuth, adminController.toggleTeamDepartment);
router.delete('/team-departments/:id', requireAuth, adminController.deleteTeamDepartment);

router.get('/navigation', requireAuth, adminController.listNavigation);
router.post('/navigation', requireAuth, adminController.createNavigationItem);
router.put('/navigation/:id', requireAuth, adminController.updateNavigationItem);
router.delete('/navigation/:id', requireAuth, adminController.deleteNavigationItem);

router.get('/settings', requireAuth, adminController.getSettings);
router.put('/settings', requireAuth, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]), adminController.updateSettings);

module.exports = router;
