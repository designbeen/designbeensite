import client from './client.js';

export const getServices = async () => {
  const { data } = await client.get('/services');
  return data.data;
};

export const getServiceBySlug = async (slug) => {
  const { data } = await client.get(`/services/${slug}`);
  return data.data;
};
