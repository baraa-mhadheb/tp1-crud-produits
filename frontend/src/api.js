const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let detail = `Erreur ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") detail = body.detail;
      else if (Array.isArray(body.detail)) detail = body.detail.map((d) => d.msg).join(", ");
    } catch {}
    throw new Error(detail);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  list: () => request("/products"),
  get: (id) => request(`/products/${id}`),
  create: (data) => request("/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/products/${id}`, { method: "DELETE" }),
};
