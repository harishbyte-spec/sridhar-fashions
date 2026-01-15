// small helper for meta CRUD
const API_BASE = "/api/meta"; // adjust if needed

function authHeaders() {
  const token = localStorage.getItem("authToken") || "";
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

export async function fetchItems(type) {
  const res = await fetch(`${API_BASE}/${type}`, { headers: authHeaders() });
  return res.json();
}

export async function createItem(type, name) {
  const res = await fetch(`${API_BASE}/${type}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function updateItem(type, id, name) {
  const res = await fetch(`${API_BASE}/${type}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function deleteItem(type, id) {
  const res = await fetch(`${API_BASE}/${type}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}
