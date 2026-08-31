import client from './client.js';

async function processFormData(formData) {
  if (!(formData instanceof FormData)) return formData;
  const payload = {};
  const galleryImages = [];

  for (const [key, value] of formData.entries()) {
    if (typeof value === 'object' && value !== null && typeof value.arrayBuffer === 'function' && value.size > 0) {
      const uploadData = new FormData();
      uploadData.append('file', value);
      const res = await client.post('/uploads', uploadData);
      const fileUrl = res.data.url;

      if (key === 'galleryImages') {
        galleryImages.push(fileUrl);
      } else if (key === 'coverImage') {
        payload.cover_image_url = fileUrl;
      } else if (key === 'image') {
        payload.image_url = fileUrl;
      } else if (key === 'avatar' || key === 'avatarFile') {
        payload.avatar_url = fileUrl;
      } else if (key === 'logoFile') {
        payload.logo_url = fileUrl;
      } else if (key === 'iconFile') {
        payload.icon = fileUrl;
      } else if (key === 'logo') {
        payload.logo_url = fileUrl;
      } else if (key === 'favicon') {
        payload.favicon_url = fileUrl;
      } else {
        payload[key] = fileUrl;
      }
    } else if (typeof value === 'string') {
      if (key === 'galleryImages') {
        galleryImages.push(value);
      } else {
        payload[key] = value;
      }
    }
  }

  if (galleryImages.length > 0) {
    payload.gallery_images = galleryImages;
  }

  return payload;
}

export const adminLogin = async (credentials) => {
  const { data } = await client.post('/admin/login', credentials);
  return data;
};

export const getAdminSession = async () => {
  const { data } = await client.get('/admin/me');
  return data.data;
};

export const getAdminContactMessages = async () => {
  const { data } = await client.get('/admin/contact-messages');
  return data.data;
};

export const getAdminServices = async () => {
  const { data } = await client.get('/admin/services');
  return data.data;
};

export const createAdminService = async (formData) => {
  const payload = await processFormData(formData);
  const { data } = await client.post('/admin/services', payload);
  return data.data;
};

export const updateAdminService = async ({ id, formData }) => {
  const payload = await processFormData(formData);
  const { data } = await client.put(`/admin/services/${id}`, payload);
  return data.data;
};

export const deleteAdminService = async (id) => {
  const { data } = await client.delete(`/admin/services/${id}`);
  return data.data;
};

export const getAdminProjects = async () => {
  const { data } = await client.get('/admin/projects');
  return data.data;
};

export const createAdminProject = async (formData) => {
  const payload = await processFormData(formData);
  const { data } = await client.post('/admin/projects', payload);
  return data.data;
};

export const updateAdminProject = async ({ id, formData }) => {
  const payload = await processFormData(formData);
  const { data } = await client.put(`/admin/projects/${id}`, payload);
  return data.data;
};

export const deleteAdminProject = async (id) => {
  const { data } = await client.delete(`/admin/projects/${id}`);
  return data.data;
};

export const getAdminTestimonials = async () => {
  const { data } = await client.get('/admin/testimonials');
  return data.data;
};

export const createAdminTestimonial = async (formData) => {
  const payload = await processFormData(formData);
  const { data } = await client.post('/admin/testimonials', payload);
  return data.data;
};

export const updateAdminTestimonial = async ({ id, formData }) => {
  const payload = await processFormData(formData);
  const { data } = await client.put(`/admin/testimonials/${id}`, payload);
  return data.data;
};

export const deleteAdminTestimonial = async (id) => {
  const { data } = await client.delete(`/admin/testimonials/${id}`);
  return data.data;
};

export const getAdminTechnologies = async () => {
  const { data } = await client.get('/admin/technologies');
  return data.data;
};

export const createAdminTechnology = async (formData) => {
  const payload = await processFormData(formData);
  const { data } = await client.post('/admin/technologies', payload);
  return data.data;
};

export const updateAdminTechnology = async ({ id, formData }) => {
  const payload = await processFormData(formData);
  const { data } = await client.put(`/admin/technologies/${id}`, payload);
  return data.data;
};

export const deleteAdminTechnology = async (id) => {
  const { data } = await client.delete(`/admin/technologies/${id}`);
  return data.data;
};

export const getAdminNavigation = async () => {
  const { data } = await client.get('/admin/navigation');
  return data.data;
};

export const createAdminNavigationItem = async (payload) => {
  const { data } = await client.post('/admin/navigation', payload);
  return data.data;
};

export const updateAdminNavigationItem = async ({ id, payload }) => {
  const { data } = await client.put(`/admin/navigation/${id}`, payload);
  return data.data;
};

export const deleteAdminNavigationItem = async (id) => {
  const { data } = await client.delete(`/admin/navigation/${id}`);
  return data.data;
};

export const getAdminSettings = async () => {
  const { data } = await client.get('/admin/settings');
  return data.data;
};

export const updateAdminSettings = async (formData) => {
  const payload = await processFormData(formData);
  const { data } = await client.put('/admin/settings', payload);
  return data.data;
};

export const updateAdminContactMessage = async ({ id, payload }) => {
  const { data } = await client.put(`/admin/contact-messages/${id}`, payload);
  return data.data;
};

export const getDashboardStats = async () => {
  const { data } = await client.get('/admin/stats');
  return data.data;
};

export const toggleAdminService = async (id) => {
  const { data } = await client.patch(`/admin/services/${id}/toggle`);
  return data.data;
};

export const toggleAdminProject = async (id) => {
  const { data } = await client.patch(`/admin/projects/${id}/toggle`);
  return data.data;
};

export const toggleAdminTechnology = async (id) => {
  const { data } = await client.patch(`/admin/technologies/${id}/toggle`);
  return data.data;
};

export const getAdminPartners = async () => {
  const { data } = await client.get('/admin/partners');
  return data.data;
};

export const createAdminPartner = async (formData) => {
  const payload = await processFormData(formData);
  const { data } = await client.post('/admin/partners', payload);
  return data.data;
};

export const updateAdminPartner = async ({ id, formData }) => {
  const payload = await processFormData(formData);
  const { data } = await client.put(`/admin/partners/${id}`, payload);
  return data.data;
};

export const toggleAdminPartner = async (id) => {
  const { data } = await client.patch(`/admin/partners/${id}/toggle`);
  return data.data;
};

export const deleteAdminPartner = async (id) => {
  const { data } = await client.delete(`/admin/partners/${id}`);
  return data.data;
};

export const getAdminTeam = async () => {
  const { data } = await client.get('/admin/team');
  return data.data;
};

export const createAdminTeamMember = async (formData) => {
  const payload = await processFormData(formData);
  const { data } = await client.post('/admin/team', payload);
  return data.data;
};

export const updateAdminTeamMember = async ({ id, formData }) => {
  const payload = await processFormData(formData);
  const { data } = await client.put(`/admin/team/${id}`, payload);
  return data.data;
};

export const toggleAdminTeamMember = async (id) => {
  const { data } = await client.patch(`/admin/team/${id}/toggle`);
  return data.data;
};

export const deleteAdminTeamMember = async (id) => {
  const { data } = await client.delete(`/admin/team/${id}`);
  return data.data;
};

export const getAdminTeamDepartments = async () => {
  const { data } = await client.get('/admin/team-departments');
  return data.data;
};

export const createAdminTeamDepartment = async (payload) => {
  const { data } = await client.post('/admin/team-departments', payload);
  return data.data;
};

export const updateAdminTeamDepartment = async ({ id, payload }) => {
  const { data } = await client.put(`/admin/team-departments/${id}`, payload);
  return data.data;
};

export const toggleAdminTeamDepartment = async (id) => {
  const { data } = await client.patch(`/admin/team-departments/${id}/toggle`);
  return data.data;
};

export const deleteAdminTeamDepartment = async (id) => {
  const { data } = await client.delete(`/admin/team-departments/${id}`);
  return data.data;
};

export const logoutAdmin = async () => {
  const { data } = await client.post('/admin/logout');
  return data;
};
