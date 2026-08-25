import client from './client.js';

export const getSettings = async () => {
  const { data } = await client.get('/settings');
  return data.data;
};

export const getNavigation = async () => {
  const { data } = await client.get('/navigation');
  return data.data;
};

export const getHero = async (page) => {
  const { data } = await client.get(`/hero/${page}`);
  return data.data;
};

export const getMethodology = async () => {
  const { data } = await client.get('/methodology');
  return data.data;
};

export const getPartners = async () => {
  const { data } = await client.get('/partners');
  return data.data;
};

export const getTeam = async () => {
  const { data } = await client.get('/team');
  return data.data;
};

export const getTeamDepartments = async () => {
  const { data } = await client.get('/team-departments');
  return data.data;
};
