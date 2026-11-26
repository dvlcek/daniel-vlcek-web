export const NAVIGATION_EVENT = "vlko:public-navigation";

/** Only public marketing routes participate; never animate account/booking management. */
export function isMarketingPath(path: string) {
  const normalized = path.replace(/\/+$/, "") || "/";
  return /^(?:\/|\/(?:about|contact|coming-soon|legal|privacy|cookies|services|work)|\/services\/(?:web-development|custom-software|automation-ai)|\/work\/[a-z0-9-]+)$/.test(normalized);
}

export function navigationTarget(href: string, current: string) {
  try {
    const from = new URL(current);
    const to = new URL(href, from);
    return to.origin === from.origin && to.pathname !== from.pathname &&
      isMarketingPath(from.pathname) && isMarketingPath(to.pathname) ? to.pathname : null;
  } catch { return null; }
}

/** One persistent overlay. Navigation itself is never delayed. */
export function createPageTransition(cover: HTMLElement, mark: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const minimumVisible = 440;
  let hold: number | undefined;
  let safety: number | undefined;
  let shownAt: number | null = null;
  let exiting = false;
  let generation = 0;

  function clearTimers() {
    window.clearTimeout(hold);
    window.clearTimeout(safety);
  }
  function reset() {
    generation++;
    clearTimers();
    cover.getAnimations().forEach(animation => animation.cancel());
    shownAt = null;
    exiting = false;
    delete cover.dataset.active;
    cover.style.visibility = "hidden";
    cover.style.opacity = "1";
    mark.style.opacity = "1";
  }
  function enabled() {
    return !reduced.matches && !document.hidden && typeof cover.animate === "function";
  }
  function show() {
    if (shownAt !== null) return;
    shownAt = performance.now();
    cover.style.visibility = "visible";
    cover.dataset.active = "true";
    cover.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 160, easing: "ease-out", fill: "both",
    });
  }
  function begin(path: string) {
    if (!enabled() || !isMarketingPath(window.location.pathname) || !isMarketingPath(path)) return;
    if (exiting) reset();
    clearTimers();
    generation++;
    show();
    // A failed or cancelled navigation cannot leave the overlay on indefinitely.
    safety = window.setTimeout(reset, 6500);
  }
  function commit(from: string, to: string) {
    if (from === to) return;
    if (!enabled() || !isMarketingPath(from) || !isMarketingPath(to)) { reset(); return; }
    if (exiting) reset();
    clearTimers();
    show();
    exiting = true;
    const token = ++generation;
    hold = window.setTimeout(() => {
      if (token !== generation) return;
      if (!enabled()) { reset(); return; }
      cover.getAnimations().forEach(animation => animation.cancel());
      const exit = cover.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 280, easing: "cubic-bezier(.4,0,.2,1)", fill: "both",
      });
      exit.onfinish = () => { if (token === generation) reset(); };
    }, Math.max(0, minimumVisible - (performance.now() - (shownAt ?? performance.now()))));
    safety = window.setTimeout(() => { if (token === generation) reset(); }, 1200);
  }
  const handleNavigation = (event: Event) => {
    const target = (event as CustomEvent<string>).detail;
    if (typeof target === "string") begin(target);
  };
  const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key === "Tab") reset(); };
  const handleVisibility = () => { if (document.hidden) reset(); };
  const handleMotion = () => { if (reduced.matches) reset(); };
  const handlePointer = () => { if (shownAt !== null) reset(); };
  window.addEventListener("pointerdown", handlePointer, { passive: true });
  window.addEventListener(NAVIGATION_EVENT, handleNavigation);
  window.addEventListener("popstate", reset);
  window.addEventListener("pagehide", reset);
  window.addEventListener("keydown", handleKey);
  document.addEventListener("visibilitychange", handleVisibility);
  reduced.addEventListener("change", handleMotion);
  reset();
  return { commit, dispose() {
    reset();
    window.removeEventListener("pointerdown", handlePointer);
    window.removeEventListener(NAVIGATION_EVENT, handleNavigation);
    window.removeEventListener("popstate", reset);
    window.removeEventListener("pagehide", reset);
    window.removeEventListener("keydown", handleKey);
    document.removeEventListener("visibilitychange", handleVisibility);
    reduced.removeEventListener("change", handleMotion);
  } };
}
