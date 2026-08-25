const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/httpError');
const publicService = require('../services/publicService');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await publicService.getSettings();
  res.json({ success: true, data: settings });
});

const getNavigation = asyncHandler(async (req, res) => {
  const navigation = await publicService.getNavigation();
  res.json({ success: true, data: navigation });
});

const getHero = asyncHandler(async (req, res) => {
  const hero = await publicService.getHero(req.params.page);
  res.json({ success: true, data: hero });
});

const getMethodology = asyncHandler(async (req, res) => {
  const methodology = await publicService.getMethodology();
  res.json({ success: true, data: methodology });
});

const getServices = asyncHandler(async (req, res) => {
  const services = await publicService.getServices();
  res.json({ success: true, data: services });
});

const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await publicService.getServiceBySlug(req.params.slug);
  if (!service) throw new HttpError(404, 'Service not found');
  res.json({ success: true, data: service });
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await publicService.getProjects();
  res.json({ success: true, data: projects });
});

const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await publicService.getProjectBySlug(req.params.slug);
  if (!project) throw new HttpError(404, 'Project not found');
  res.json({ success: true, data: project });
});

const getTechnologies = asyncHandler(async (req, res) => {
  const technologies = await publicService.getTechnologies();
  res.json({ success: true, data: technologies });
});

const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await publicService.getTestimonials();
  res.json({ success: true, data: testimonials });
});

const getPartners = asyncHandler(async (req, res) => {
  const partners = await publicService.getPartners();
  res.json({ success: true, data: partners });
});

const getTeam = asyncHandler(async (req, res) => {
  const team = await publicService.getTeam();
  res.json({ success: true, data: team });
});

const getTeamDepartments = asyncHandler(async (req, res) => {
  const departments = await publicService.getTeamDepartments();
  res.json({ success: true, data: departments });
});

const postContact = asyncHandler(async (req, res) => {
  const result = await publicService.createContactMessage({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
    ip_address: req.ip,
    user_agent: req.get('user-agent'),
  });

  res.status(201).json({ success: true, data: result, message: 'Contact message submitted' });
});

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
  postContact,
};
