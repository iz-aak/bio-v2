export function initNav() {
  const links = document.querySelectorAll(".navpill a[data-target]");
  const map = new Map();
  links.forEach((a) => {
    const id = a.dataset.target;
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });

  const io = new IntersectionObserver(
    (entries) => {
      let best = null;
      for (const e of entries) {
        if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
      }
      if (best) {
        links.forEach((l) => l.classList.remove("active"));
        map.get(best.target)?.classList.add("active");
      }
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.6, 1] }
  );
  map.forEach((_, sec) => io.observe(sec));
}
