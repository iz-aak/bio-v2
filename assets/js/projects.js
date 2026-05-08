const PROJECTS = [
  { name: "FluxTV",            desc: "3,000,000+ free movies and shows",            tag: "Streaming", status: "live", href: "https://fluxtv.qzz.io" },
  { name: "CineDown",          desc: "Download 3M+ movies & episodes for free",     tag: "Tools",     status: "live", href: "https://cinedown.qzz.io" },
  { name: "ZXAI",              desc: "Cheapest sparx autocompleter (staff)",        tag: "AI",        status: "live", href: "https://zxai.dev" },
  { name: "FluxusTV",          desc: "Legacy FluxTV",                                tag: "Streaming", status: "live", href: "#" },
  { name: "VyrxAI",            desc: "Web developer for VyrxAI",                     tag: "AI",        status: "live", href: "#" },
  { name: "This Site",         desc: "uhhhhh bio site ig",                           tag: "Personal",  status: "live", href: "https://izaa.k.vu" },
  { name: "Temp Email",        desc: "Disposable email address",                     tag: "Tools",     status: "live", href: "#" },
  { name: "Magnet Downloader", desc: "Download from .torrent / magnet link",         tag: "Tools",     status: "dev",  href: "#" },
  { name: "Torrent Index",     desc: "Scrapes TPB & 1337x for magnets",              tag: "Tools",     status: "dev",  href: "#" },
  { name: "ProxyK",            desc: "Free web proxy via Reflect4 API",              tag: "Tools",     status: "dev",  href: "#" },
];

export function initProjects() {
  const root = document.querySelector("[data-projects]");
  if (!root) return;
  root.innerHTML = PROJECTS.map((p) => `
    <a class="card project" href="/redirect?to=${encodeURIComponent(p.href)}" rel="noopener">
      <div class="project-head">
        <span class="pill ${p.status}">${p.status === "live" ? "Live" : "In Dev"}</span>
        <span class="pill" style="margin-left:auto">${p.tag}</span>
      </div>
      <div class="project-title">${escapeHtml(p.name)}</div>
      <div class="project-desc">${escapeHtml(p.desc)}</div>
    </a>
  `).join("");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));
}
