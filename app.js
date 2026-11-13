(() => {
  "use strict";

  const root = document.documentElement;
  const stage = document.querySelector(".stage-viewport");
  const sheets = [...document.querySelectorAll(".sheet")];

  function updateScale() {
    if (!sheets.length || !stage) return;
    const horizontalPadding = window.innerWidth <= 600 ? 16 : 36;
    const availableWidth = Math.max(1, stage.clientWidth - horizontalPadding);
    const sheetWidth = sheets[0].offsetWidth;
    const sheetHeight = sheets[0].offsetHeight;
    if (!sheetWidth || !sheetHeight) return;

    const scale = Math.min(1, availableWidth / sheetWidth);
    root.style.setProperty("--sheet-scale", String(scale));
    root.style.setProperty("--frame-width", `${sheetWidth * scale}px`);
    root.style.setProperty("--frame-height", `${sheetHeight * scale}px`);
  }

  function syncSheetPlayback(sheet, isVisible) {
    sheet.dataset.paused = isVisible ? "false" : "true";
    sheet.querySelectorAll("video").forEach((video) => {
      if (isVisible) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          syncSheetPlayback(entry.target, entry.isIntersecting);
        });
      },
      { rootMargin: "150px 0px", threshold: 0.01 }
    );
    sheets.forEach((sheet) => observer.observe(sheet));
  } else {
    sheets.forEach((sheet) => syncSheetPlayback(sheet, true));
  }

  if ("ResizeObserver" in window && stage) {
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(stage);
  }
  window.addEventListener("resize", updateScale);
  document.fonts.ready.then(updateScale);
  updateScale();
})();
