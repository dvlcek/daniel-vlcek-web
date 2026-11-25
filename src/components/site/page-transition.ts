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

/** One persistent, non-blocking overlay; routing is never intercepted or delayed. */
export function createPageTransition(cover: HTMLElement, mark: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  // A single intact brand mark. Hold only the visual layer, never the router.
  const signatureDuration = 520;
  let delay: number | undefined;
  let exitDelay: number | undefined;
  let timeout: number | undefined;
  let shownAt: number | null = null;
  let exiting = false;
  let generation = 0;
  const stopAnimations = () => {
    cover.getAnimations().forEach(animation => animation.cancel());
    mark.getAnimations().forEach(animation => animation.cancel());
  };
  function clearTimers() {
    window.clearTimeout(delay);
    window.clearTimeout(exitDelay);
    window.clearTimeout(timeout);
  }
  function reset() {
    generation++;
    clearTimers();
    stopAnimations();
    shownAt = null;
    exiting = false;
    cover.style.visibility = "hidden";
    cover.style.opacity = "1";
    mark.style.opacity = "0";
  }
  function enabled() {
    return !reduced.matches && !document.hidden && typeof cover.animate === "function";
  }
  function show() {
    if (shownAt !== null) return;
    shownAt = performance.now();
    cover.style.visibility = "visible";
    cover.style.opacity = "1";
    mark.style.opacity = "1";
    cover.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 120, easing: "ease-out", fill: "both",
    });
    mark.animate([
      { opacity: 0, transform: "translateY(3px) scale(.97)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ], { duration: 300, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" });
  }
  function begin(path: string) {
    if (!enabled() || !isMarketingPath(window.location.pathname) || !isMarketingPath(path)) return;
    reset();
    const token = generation;
    delay = window.setTimeout(() => {
      if (token === generation && enabled()) show();
    }, 100);
    // Never leave a stalled or cancelled navigation covered indefinitely.
    timeout = window.setTimeout(reset, 6500);
  }
  function commit(from: string, to: string) {
    if (from === to) return;
    if (!enabled() || !isMarketingPath(from) || !isMarketingPath(to)) { reset(); return; }
    if (exiting) reset();
    clearTimers();
    show();
    exiting = true;
    const token = ++generation;
    // Routing is already committed. Give the signature a short visual window,
    // then reveal the destination; slow navigations get no extra hold.
    const hold = Math.max(0, signatureDuration - (performance.now() - (shownAt ?? performance.now())));
    exitDelay = window.setTimeout(() => {
      if (token !== generation) return;
      if (!enabled()) { reset(); return; }
      // The entrance is complete. Fade the cover and mark together.
      cover.getAnimations().forEach(animation => animation.cancel());
      const exit = cover.animate([
        { opacity: 1 }, { opacity: 0 }
      ], { duration: 300, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" });
      exit.onfinish = () => { if (generation === token) reset(); };
    }, hold);
    timeout = window.setTimeout(() => { if (generation === token) reset(); }, 1200);
  }
  const handleNavigation = (event: Event) => {
    const path = (event as CustomEvent<string>).detail;
    if (typeof path === "string") begin(path);
  };
  const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key === "Tab") reset(); };
  const handleVisibility = () => { if (document.hidden) reset(); };
  const handleMotion = () => { if (reduced.matches) reset(); };
  const handlePointer = () => { if (shownAt !== null) reset(); };
  window.addEventListener("pointerdown", handlePointer, { passive: true });
  window.addEventListener(NAVIGATION_EVENT, handleNavigation);
  window.addEventListener("popstate", reset);
  window.addEventListener("pagehide", reset);
  window.addEventListener("keydown", handleEscape);
  document.addEventListener("visibilitychange", handleVisibility);
  reduced.addEventListener("change", handleMotion);
  reset();
  return { commit, dispose() {
    reset();
    window.removeEventListener("pointerdown", handlePointer);
    window.removeEventListener(NAVIGATION_EVENT, handleNavigation);
    window.removeEventListener("popstate", reset);
    window.removeEventListener("pagehide", reset);
    window.removeEventListener("keydown", handleEscape);
    document.removeEventListener("visibilitychange", handleVisibility);
    reduced.removeEventListener("change", handleMotion);
  } };
}
