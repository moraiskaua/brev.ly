import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api',
});

export async function getLinks() {
  const { data } = await api.get('/links');

  return data.data;
}

export async function createLink(originalUrl: string, shortUrl: string) {
  const { data } = await api.post('/links', { originalUrl, shortUrl });
  return data;
}

export async function deleteLink(id: string) {
  const { data } = await api.delete(`/links/${id}`);
  return data;
}

export async function exportCsv() {
  const { data } = await api.get('/links/export/csv');
  return data.data.csvUrl;
}
