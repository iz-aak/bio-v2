export function initFooter() {
  const el = document.querySelector("[data-clock]");
  if (!el) return;
  const tick = () => {
    const d = new Date();
    el.textContent = d.toLocaleTimeString("en-GB", { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}
