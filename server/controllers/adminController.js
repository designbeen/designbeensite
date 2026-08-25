const asyncHandler = require('../utils/asyncHandler');
const adminService = require('../services/adminService');
const HttpError = require('../utils/httpError');

const login = asyncHandler(async (req, res) => {
  const result = await adminService.login(req.body);
  res.cookie('auth_token', result.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ success: true, data: result.user, message: 'Logged in successfully' });
});

const me = asyncHandler(async (req, res) => {
  if (!req.user) throw new HttpError(401, 'Not authenticated');
  const user = await adminService.getSessionUser(req.user.id);
  if (!user) throw new HttpError(401, 'Not authenticated');
  res.json({ success: true, data: user });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

const listContactMessages = asyncHandler(async (req, res) => {
  const messages = await adminService.listContactMessages();
  res.json({ success: true, data: messages });
});

const updateContactMessage = asyncHandler(async (req, res) => {
  const result = await adminService.updateContactMessage(req.params.id, req.body);
  res.json({ success: true, data: result });
});

const listServices = asyncHandler(async (req, res) => {
  const services = await adminService.listServices();
  res.json({ success: true, data: services });
});

const createService = asyncHandler(async (req, res) => {
  const result = await adminService.createService(req.body, req.file);
  res.status(201).json({ success: true, data: result });
});

const updateService = asyncHandler(async (req, res) => {
  const result = await adminService.updateService(req.params.id, req.body, req.file);
  res.json({ success: true, data: result });
});

const deleteService = asyncHandler(async (req, res) => {
  const result = await adminService.deleteService(req.params.id);
  res.json({ success: true, data: result });
});

const listProjects = asyncHandler(async (req, res) => {
  const projects = await adminService.listProjects();
  res.json({ success: true, data: projects });
});

const createProject = asyncHandler(async (req, res) => {
  const result = await adminService.createProject(req.body, req.files);
  res.status(201).json({ success: true, data: result });
});

const updateProject = asyncHandler(async (req, res) => {
  const result = await adminService.updateProject(req.params.id, req.body, req.files);
  res.json({ success: true, data: result });
});

const deleteProject = asyncHandler(async (req, res) => {
  const result = await adminService.deleteProject(req.params.id);
  res.json({ success: true, data: result });
});

const listTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await adminService.listTestimonials();
  res.json({ success: true, data: testimonials });
});

const createTestimonial = asyncHandler(async (req, res) => {
  const result = await adminService.createTestimonial(req.body, req.file);
  res.status(201).json({ success: true, data: result });
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const result = await adminService.updateTestimonial(req.params.id, req.body, req.file);
  res.json({ success: true, data: result });
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const result = await adminService.deleteTestimonial(req.params.id);
  res.json({ success: true, data: result });
});

const listTechnologies = asyncHandler(async (req, res) => {
  const technologies = await adminService.listTechnologies();
  res.json({ success: true, data: technologies });
});

const createTechnology = asyncHandler(async (req, res) => {
  const result = await adminService.createTechnology(req.body, req.file);
  res.status(201).json({ success: true, data: result });
});

const updateTechnology = asyncHandler(async (req, res) => {
  const result = await adminService.updateTechnology(req.params.id, req.body, req.file);
  res.json({ success: true, data: result });
});

const deleteTechnology = asyncHandler(async (req, res) => {
  const result = await adminService.deleteTechnology(req.params.id);
  res.json({ success: true, data: result });
});

const listNavigation = asyncHandler(async (req, res) => {
  const navigation = await adminService.listNavigation();
  res.json({ success: true, data: navigation });
});

const createNavigationItem = asyncHandler(async (req, res) => {
  const result = await adminService.createNavigationItem(req.body);
  res.status(201).json({ success: true, data: result });
});

const updateNavigationItem = asyncHandler(async (req, res) => {
  const result = await adminService.updateNavigationItem(req.params.id, req.body);
  res.json({ success: true, data: result });
});

const deleteNavigationItem = asyncHandler(async (req, res) => {
  const result = await adminService.deleteNavigationItem(req.params.id);
  res.json({ success: true, data: result });
});

const getSettings = asyncHandler(async (req, res) => {
  const settings = await adminService.getSettings();
  res.json({ success: true, data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const result = await adminService.updateSettings(req.body, {
    logo_url: req.files?.logo?.[0] ? `/uploads/${req.files.logo[0].filename}` : null,
    favicon_url: req.files?.favicon?.[0] ? `/uploads/${req.files.favicon[0].filename}` : null,
  });
  res.json({ success: true, data: result });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.json({ success: true, data: stats });
});

const toggleService = asyncHandler(async (req, res) => {
  const result = await adminService.toggleServiceStatus(req.params.id);
  res.json({ success: true, data: result });
});

const toggleProject = asyncHandler(async (req, res) => {
  const result = await adminService.toggleProjectFeatured(req.params.id);
  res.json({ success: true, data: result });
});

const toggleTechnology = asyncHandler(async (req, res) => {
  const result = await adminService.toggleTechnologyStatus(req.params.id);
  res.json({ success: true, data: result });
});

const listPartners = asyncHandler(async (req, res) => {
  const partners = await adminService.listPartners();
  res.json({ success: true, data: partners });
});

const createPartner = asyncHandler(async (req, res) => {
  const result = await adminService.createPartner(req.body, req.file);
  res.status(201).json({ success: true, data: result });
});

const updatePartner = asyncHandler(async (req, res) => {
  const result = await adminService.updatePartner(req.params.id, req.body, req.file);
  res.json({ success: true, data: result });
});

const togglePartner = asyncHandler(async (req, res) => {
  const result = await adminService.togglePartnerStatus(req.params.id);
  res.json({ success: true, data: result });
});

const deletePartner = asyncHandler(async (req, res) => {
  const result = await adminService.deletePartner(req.params.id);
  res.json({ success: true, data: result });
});

const listTeamMembers = asyncHandler(async (req, res) => {
  const team = await adminService.listTeamMembers();
  res.json({ success: true, data: team });
});

const createTeamMember = asyncHandler(async (req, res) => {
  const result = await adminService.createTeamMember(req.body, req.file);
  res.status(201).json({ success: true, data: result });
});

const updateTeamMember = asyncHandler(async (req, res) => {
  const result = await adminService.updateTeamMember(req.params.id, req.body, req.file);
  res.json({ success: true, data: result });
});

const toggleTeamMember = asyncHandler(async (req, res) => {
  const result = await adminService.toggleTeamMemberStatus(req.params.id);
  res.json({ success: true, data: result });
});

const deleteTeamMember = asyncHandler(async (req, res) => {
  const result = await adminService.deleteTeamMember(req.params.id);
  res.json({ success: true, data: result });
});

const listTeamDepartments = asyncHandler(async (req, res) => {
  const departments = await adminService.listTeamDepartments();
  res.json({ success: true, data: departments });
});

const createTeamDepartment = asyncHandler(async (req, res) => {
  const result = await adminService.createTeamDepartment(req.body);
  res.status(201).json({ success: true, data: result });
});

const updateTeamDepartment = asyncHandler(async (req, res) => {
  const result = await adminService.updateTeamDepartment(req.params.id, req.body);
  res.json({ success: true, data: result });
});

const toggleTeamDepartment = asyncHandler(async (req, res) => {
  const result = await adminService.toggleTeamDepartmentStatus(req.params.id);
  res.json({ success: true, data: result });
});

const deleteTeamDepartment = asyncHandler(async (req, res) => {
  const result = await adminService.deleteTeamDepartment(req.params.id);
  res.json({ success: true, data: result });
});

module.exports = {
  login,
  me,
  logout,
  getDashboardStats,
  listContactMessages,
  updateContactMessage,
  listServices,
  createService,
  updateService,
  deleteService,
  toggleService,
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  toggleProject,
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  listTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  toggleTechnology,
  listPartners,
  createPartner,
  updatePartner,
  togglePartner,
  deletePartner,
  listTeamMembers,
  createTeamMember,
  updateTeamMember,
  toggleTeamMember,
  deleteTeamMember,
  listTeamDepartments,
  createTeamDepartment,
  updateTeamDepartment,
  toggleTeamDepartment,
  deleteTeamDepartment,
  listNavigation,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  getSettings,
  updateSettings,
};
