import client from './client.js';

export const getTechnologies = async () => {
  const { data } = await client.get('/technologies');
  return data.data;
};
