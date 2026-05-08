import { getJSON, fmtNum, relTime } from "./api.js";

export async function initStats() {
  const root = document.querySelector("[data-stats]");
  if (!root) return;
  let s;
  try { s = await getJSON("/api/stats"); }
  catch (e) { root.innerHTML = `<div class="card stat"><span class="stat-label">Stats</span><span class="stat-sub">Unavailable</span></div>`; return; }

  const tiles = [
    {
      label: "Last.fm · top artist",
      value: s.lastfm?.topArtist?.name || "—",
      sub: s.lastfm?.scrobblesWeek != null ? `${fmtNum(s.lastfm.scrobblesWeek)} scrobbles / wk` : "—",
    },
    {
      label: "GitHub",
      value: `★ ${fmtNum(s.github?.stars)}`,
      sub: s.github?.latest ? `${s.github.latest.repo} · ${relTime(s.github.latest.at)}` : `${fmtNum(s.github?.repos)} repos`,
    },
    {
      label: "Reddit karma",
      value: fmtNum(s.reddit?.karma),
      sub: s.reddit?.user ? `u/${s.reddit.user}` : "ssprix",
    },
    {
      label: "Site",
      value: fmtNum(s.site?.viewsTotal),
      sub: `${fmtNum(s.site?.viewsToday)} today · ${fmtNum(s.site?.guestbookCount)} signs`,
    },
  ];

  if (s.currently) {
    tiles.unshift({ label: "Currently", value: s.currently, sub: "" });
  }

  root.innerHTML = tiles.map((t) => `
    <div class="card stat">
      <span class="stat-label">${escapeHtml(t.label)}</span>
      <span class="stat-value">${escapeHtml(String(t.value))}</span>
      <span class="stat-sub">${escapeHtml(t.sub || "")}</span>
    </div>
  `).join("");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));
}
