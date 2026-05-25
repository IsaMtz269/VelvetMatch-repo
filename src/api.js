const BASE = 'http://localhost:5000/api';

export async function fetchNegocios() {
  const res = await fetch(`${BASE}/negocios`);
  return res.json();
}

export async function fetchUsuarios() {
  const res = await fetch(`${BASE}/usuarios`);
  return res.json();
}

export async function fetchAnalyticsGlobal() {
  const res = await fetch(`${BASE}/analytics/global`);
  return res.json();
}