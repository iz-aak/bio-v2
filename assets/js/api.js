// Set this to your deployed Worker origin. Leave empty if Worker is mounted on same origin under /api/*.
export const API_BASE = ""; // e.g. "https://api.izaa.k.vu"

const url = (p) => `${API_BASE}${p}`;

export async function getJSON(path, opts = {}) {
  const res = await fetch(url(path), { credentials: "include", ...opts });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function postJSON(path, body) {
  const res = await fetch(url(path), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || res.statusText), { status: res.status, data });
  return data;
}

export function fmtNum(n) {
  return new Intl.NumberFormat("en-US").format(n ?? 0);
}

export function relTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString();
}
