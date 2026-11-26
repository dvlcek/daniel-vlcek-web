"use client";

import { useEffect, type RefObject } from "react";
import { isMarketingPath } from "./page-transition";

const ease = "cubic-bezier(.22, 1, .36, 1)";
const presets = {
  heading: { y: 14, opacity: .74, duration: 620 },
  subheading: { y: 7, opacity: .88, duration: 440 },
  intro: { y: 8, opacity: .88, duration: 480 },
  project: { y: 10, opacity: .86, duration: 560 },
  portrait: { y: 10, opacity: .87, duration: 640 },
  step: { y: 7, opacity: .9, duration: 460 },
  detail: { y: 5, opacity: .92, duration: 360 },
  closing: { y: 12, opacity: .82, duration: 600 },
  footer: { y: 0, opacity: .94, duration: 400 },
} as const;
type Preset = keyof typeof presets;
const marked = "[data-marketing-reveal]";
const excluded = 'form, dialog, [role="dialog"], [role="alertdialog"], [role="listbox"], [role="tablist"], [role="tabpanel"], details, nav, #booking, [data-motion="off"], [inert], [hidden], [aria-hidden="true"]';

/** Legacy section markers are retained for compatibility, but no longer create observers. */
export function MarketingReveal() { return null; }

/** Mounted once in the persistent public page transition component. */
export function MarketingSiteMotion({ pathname, coverRef }: {
  pathname: string | null;
  coverRef: RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    if (!pathname || !isMarketingPath(pathname) || typeof IntersectionObserver === "undefined" ||
        typeof MutationObserver === "undefined" || typeof Element.prototype.animate !== "function") return;
    const completed = new WeakSet<HTMLElement>();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const legal = /^\/(legal|privacy|cookies)(\/|$)/.test(pathname);
    const home = pathname === "/";
    const pending = new Map<HTMLElement, Preset>();
    const active = new Map<HTMLElement, Animation>();
    const waiting = new Map<HTMLElement, Preset>();
    let frame = 0;
    let observer: IntersectionObserver | null = null;
    const covered = () => coverRef.current?.dataset.active === "true";

    function blocked(el: HTMLElement) {
      return !el.isConnected || !!el.closest(excluded) ||
        (home && (!!el.closest('#hero, section[aria-labelledby="hero-heading"]') || (el.matches('h1')) ||
          (!!el.closest('#system') && !el.matches('h2'))));
    }
    function play(el: HTMLElement, key: Preset) {
      if (completed.has(el)) return;
      pending.delete(el); waiting.delete(el); observer?.unobserve(el);
      completed.add(el);
      if (reduced.matches || document.hidden || blocked(el) || el.contains(document.activeElement)) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height || rect.bottom <= 0 || rect.top >= innerHeight) return;
      // Do not stack on another animation or change the geometry of interactive containers.
      for (let node: HTMLElement | null = el; node && node !== document.body; node = node.parentElement) {
        if (node.getAnimations().some(a => a.playState === 'running' || a.pending)) return;
      }
      const style = getComputedStyle(el), opacity = Number(style.opacity);
      if (!Number.isFinite(opacity) || opacity <= 0 || style.visibility !== 'visible') return;
      const preset = presets[key];
      const y = mobile.matches ? Math.min(preset.y, 7) : preset.y;
      const canMove = y > 0 && style.transform === 'none' && (!style.translate || style.translate === 'none') &&
        style.position !== 'fixed' && style.position !== 'sticky';
      const frames: Keyframe[] = [
        { opacity: opacity * preset.opacity, ...(canMove ? { translate: `0 ${y}px` } : {}) },
        { opacity, ...(canMove ? { translate: '0 0' } : {}) },
      ];
      const animation = el.animate(frames, { duration: mobile.matches ? Math.min(preset.duration, 480) : preset.duration, easing: ease });
      active.set(el, animation);
      const forget = () => { if (active.get(el) === animation) active.delete(el); };
      animation.onfinish = forget; animation.oncancel = forget;
    }
    function enter(el: HTMLElement, key: Preset) {
      if (covered()) { observer?.unobserve(el); pending.delete(el); waiting.set(el, key); }
      else play(el, key);
    }
    function flush() {
      if (covered()) return;
      for (const [el, key] of waiting) play(el, key);
    }
    function register(el: HTMLElement, key: Preset) {
      if (blocked(el) || completed.has(el) || pending.has(el) || waiting.has(el)) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height || rect.bottom <= 0) return;
      if (rect.top < innerHeight) {
        // Initial visible content stays readable; only the page title gets an entrance.
        if (el.matches('h1') && !home) enter(el, key);
        else if (covered()) enter(el, key);
        else completed.add(el);
        return;
      }
      pending.set(el, key); observer?.observe(el);
    }
    function scan() {
      frame = 0;
      if (reduced.matches || document.hidden || !observer) return;
      for (const el of pending.keys()) if (!el.isConnected) { observer.unobserve(el); pending.delete(el); }
      for (const el of waiting.keys()) if (!el.isConnected) waiting.delete(el);
      for (const [el, animation] of active) if (!el.isConnected) animation.cancel();
      const roots = document.querySelectorAll<HTMLElement>('main, [role="main"]');
      for (const root of roots) {
        // Explicit groups retain their original motion presets. Intro/closing animate just the title.
        if (!legal) for (const el of root.querySelectorAll<HTMLElement>(marked)) {
          const key = el.dataset.marketingReveal as Preset;
          if (!Object.prototype.hasOwnProperty.call(presets, key) || el.parentElement?.closest(marked)) continue;
          const title = (key === 'intro' || key === 'closing') ? el.querySelector<HTMLElement>('h1,h2') : null;
          register(title ?? el, title ? 'heading' : key);
        }
        for (const el of root.querySelectorAll<HTMLElement>(legal ? 'h1,h2' : 'h1,h2,h3,figure')) {
          const group = el.closest<HTMLElement>(marked);
          if (!legal && group && group !== el && !['intro','closing'].includes(group.dataset.marketingReveal ?? '')) continue;
          if (el.matches('figure') && el.querySelector(marked)) continue;
          register(el, el.matches('h1,h2') ? 'heading' : el.matches('h3') ? 'subheading' : 'project');
        }
      }
      const footer = document.querySelector<HTMLElement>('footer:not(main footer)');
      if (footer && !legal) register(footer, 'footer');
      flush();
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(scan); }
    function cancelAll() {
      if (frame) cancelAnimationFrame(frame); frame = 0;
      observer?.disconnect(); observer = null;
      pending.clear(); waiting.clear();
      for (const animation of active.values()) animation.cancel();
      active.clear();
    }
    function start() {
      cancelAll();
      if (reduced.matches || document.hidden) return;
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement, key = pending.get(el);
          if (entry.isIntersecting && key) enter(el, key);
        }
      }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
      schedule();
    }
    const changes = new MutationObserver(records => {
      if (records.some(r => [...r.addedNodes, ...r.removedNodes].some(n => n.nodeType === Node.ELEMENT_NODE))) schedule();
    });
    changes.observe(document.body, { childList: true, subtree: true });
    const coverChanges = new MutationObserver(flush);
    if (coverRef.current) coverChanges.observe(coverRef.current, { attributes: true, attributeFilter: ['data-active'] });
    function onInteraction(event: Event) {
      if (!(event.target instanceof Node)) return;
      for (const [el, animation] of active) if (el.contains(event.target)) animation.cancel();
    }
    start();
    reduced.addEventListener('change', start);
    document.addEventListener('visibilitychange', start);
    document.addEventListener('focusin', onInteraction);
    document.addEventListener('pointerdown', onInteraction, { passive: true });
    return () => {
      cancelAll(); changes.disconnect(); coverChanges.disconnect();
      reduced.removeEventListener('change', start);
      document.removeEventListener('visibilitychange', start);
      document.removeEventListener('focusin', onInteraction);
      document.removeEventListener('pointerdown', onInteraction);
    };
  }, [pathname, coverRef]);
  return null;
}
