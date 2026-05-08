export function initGallery() {
  const dlg = document.querySelector("[data-lightbox]");
  const img = dlg?.querySelector("img");
  const close = document.querySelector("[data-lb-close]");
  if (!dlg || !img) return;

  document.querySelectorAll(".cat").forEach((btn) => {
    btn.addEventListener("click", () => {
      img.src = btn.dataset.src;
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.setAttribute("open", "");
    });
  });

  const closeFn = () => { dlg.close?.(); dlg.removeAttribute("open"); img.src = ""; };
  close?.addEventListener("click", closeFn);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) closeFn(); });
}
