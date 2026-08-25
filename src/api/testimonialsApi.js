import client from './client.js';

export const getTestimonials = async () => {
  const { data } = await client.get('/testimonials');
  return data.data;
};
