import client from './client.js';

export const getProjects = async () => {
  const { data } = await client.get('/projects');
  return data.data;
};

export const getProjectBySlug = async (slug) => {
  const { data } = await client.get(`/projects/${slug}`);
  return data.data;
};
