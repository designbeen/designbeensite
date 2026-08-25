import client from './client.js';

export const sendContactMessage = async (payload) => {
  const { data } = await client.post('/contact', payload);
  return data;
};
