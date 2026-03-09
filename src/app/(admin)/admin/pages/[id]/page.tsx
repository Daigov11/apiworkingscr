"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SectionForm from "@/components/admin/SectionForm";
import { adminDeletePage, adminGetPage, adminUpdatePage } from "@/lib/api/cmsAdmin";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');

  .pb-root, .pb-root * {
    box-sizing: border-box;
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* ── LAYOUT ── */
  .pb-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    min-height: 100%;
  }
  @media (min-width: 1024px) {
    .pb-layout { grid-template-columns: 1fr 320px; align-items: start; }
  }

  /* ── TOPBAR ── */
  .pb-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e7e5e4;
  }
  .pb-page-title {
    font-size: 18px;
    font-weight: 700;
    color: #1c1917;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .pb-page-id {
    font-size: 12px;
    font-weight: 500;
    color: #a8a29e;
    letter-spacing: 0;
  }

  /* ── STATUS PILLS ── */
  .pb-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11.5px; font-weight: 600;
    padding: 3px 9px; border-radius: 20px;
    letter-spacing: 0.01em;
  }
  .pb-pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .pb-pill--saved    { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .pb-pill--dirty    { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
  .pb-pill--draft    { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
  .pb-pill--pub      { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
  .pb-pill-dot--saved  { background: #16a34a; }
  .pb-pill-dot--dirty  { background: #b45309; }
  .pb-pill-dot--pub    { background: #2563eb; }
  .pb-pill-dot--draft  { background: #94a3b8; }

  /* ── ACTION BUTTONS ── */
  .pb-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 500;
    padding: 7px 13px; border-radius: 8px;
    border: 1px solid #e7e5e4;
    background: #fff;
    color: #44403c;
    cursor: pointer;
    text-decoration: none;
    transition: background .1s, border-color .1s, color .1s;
    white-space: nowrap;
    font-family: inherit;
  }
  .pb-btn:hover { background: #f5f5f4; color: #1c1917; }
  .pb-btn--primary {
    background: #18181b; border-color: #18181b; color: #fff; font-weight: 600;
  }
  .pb-btn--primary:hover { background: #27272a; border-color: #27272a; }
  .pb-btn--primary:disabled { opacity: .45; cursor: not-allowed; }
  .pb-btn--danger {
    background: #fff1f2; border-color: #fecdd3; color: #be123c;
  }
  .pb-btn--danger:hover { background: #ffe4e6; }
  .pb-btn--ghost { border-color: transparent; background: transparent; }
  .pb-btn--ghost:hover { background: #f5f5f4; }
  .pb-btn--disabled { pointer-events: none; opacity: .4; }

  /* ── PANELS ── */
  .pb-panel {
    background: #fff;
    border: 1px solid #e7e5e4;
    border-radius: 12px;
    overflow: hidden;
  }
  .pb-panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #f5f5f4;
    background: #fafaf9;
  }
  .pb-panel-title {
    font-size: 12.5px; font-weight: 700;
    color: #1c1917; letter-spacing: 0.01em;
    text-transform: uppercase;
  }
  .pb-panel-body { padding: 16px; }

  /* ── FORM FIELDS ── */
  .pb-label {
    display: block;
    font-size: 11.5px; font-weight: 600;
    color: #78716c; letter-spacing: 0.03em;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  .pb-input, .pb-textarea, .pb-select {
    width: 100%;
    font-size: 13.5px; font-weight: 400;
    color: #1c1917;
    padding: 8px 11px;
    border-radius: 8px;
    border: 1px solid #e7e5e4;
    background: #fff;
    outline: none;
    transition: border-color .12s, box-shadow .12s;
    font-family: inherit;
    appearance: none;
  }
  .pb-input:focus, .pb-textarea:focus, .pb-select:focus {
    border-color: #a8a29e;
    box-shadow: 0 0 0 3px rgba(168,162,158,.12);
  }
  .pb-textarea { resize: vertical; line-height: 1.5; }
  .pb-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23a8a29e' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; cursor: pointer; }
  .pb-field { margin-bottom: 14px; }
  .pb-field:last-child { margin-bottom: 0; }

  /* ── SEO ── */
  .pb-seo-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600;
    padding: 3px 8px; border-radius: 20px;
    border: 1px solid transparent;
  }
  .pb-seo-pill--good { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
  .pb-seo-pill--warn { background: #fffbeb; color: #b45309; border-color: #fde68a; }
  .pb-seo-pill--bad  { background: #fff1f2; color: #be123c; border-color: #fecdd3; }
  .pb-seo-dot { font-size: 8px; }

  .pb-google-preview {
    background: #fff;
    border: 1px solid #e7e5e4;
    border-radius: 10px;
    padding: 14px 16px;
    margin-top: 12px;
  }
  .pb-gp-label { font-size: 10px; font-weight: 600; color: #a8a29e; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 8px; }
  .pb-gp-title { font-size: 17px; font-weight: 400; color: #1a0dab; line-height: 1.3; }
  .pb-gp-url   { font-size: 12px; color: #006621; margin: 3px 0; }
  .pb-gp-desc  { font-size: 13px; color: #4d5156; line-height: 1.5; }

  /* ── SECTION TYPES GRID ── */
  .pb-types-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-top: 12px;
  }
  .pb-type-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid #e7e5e4;
    background: #fff;
    font-size: 12.5px; font-weight: 500;
    color: #44403c;
    cursor: pointer;
    text-align: left;
    transition: all .1s;
    font-family: inherit;
    line-height: 1.2;
  }
  .pb-type-btn:hover { background: #fafaf9; border-color: #d4d0cb; color: #1c1917; }
  .pb-type-icon { font-size: 14px; flex-shrink: 0; }

  /* ── SECTION CARDS ── */
  .pb-section-card {
    background: #fff;
    border: 1px solid #e7e5e4;
    border-radius: 10px;
    overflow: hidden;
    transition: box-shadow .15s;
  }
  .pb-section-card--dragging {
    box-shadow: 0 8px 24px rgba(0,0,0,.1);
    border-color: #d4d0cb;
  }
  .pb-section-card-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px;
    background: #fafaf9;
    border-bottom: 1px solid #f5f5f4;
    gap: 8px;
    flex-wrap: wrap;
  }
  .pb-section-card-body { padding: 14px; }
  .pb-section-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .pb-section-index {
    font-size: 11px; font-weight: 700;
    color: #a8a29e; font-variant-numeric: tabular-nums;
    background: #f5f5f4;
    border: 1px solid #e7e5e4;
    border-radius: 5px;
    padding: 2px 7px;
    letter-spacing: .02em;
  }
  .pb-section-type {
    font-size: 12.5px; font-weight: 600;
    color: #1c1917;
    background: #f5f5f4;
    border: 1px solid #e7e5e4;
    border-radius: 5px;
    padding: 2px 8px;
    font-variant: small-caps;
    letter-spacing: .04em;
  }
  .pb-section-ok {
    font-size: 11px; font-weight: 600;
    padding: 2px 8px; border-radius: 20px;
  }
  .pb-section-ok--ok  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .pb-section-ok--err { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }

  .pb-drag-handle {
    cursor: grab; color: #d4d0cb;
    padding: 4px; border-radius: 5px;
    font-size: 16px; line-height: 1;
    border: none; background: transparent;
    transition: color .1s;
  }
  .pb-drag-handle:hover { color: #a8a29e; }
  .pb-drag-handle:active { cursor: grabbing; }

  .pb-section-actions { display: flex; align-items: center; gap: 4px; }
  .pb-section-btn {
    display: grid; place-items: center;
    width: 28px; height: 28px;
    border-radius: 6px;
    border: 1px solid #e7e5e4;
    background: transparent;
    color: #78716c;
    cursor: pointer;
    font-size: 12px;
    transition: all .1s;
    font-family: inherit;
  }
  .pb-section-btn:hover { background: #f5f5f4; color: #1c1917; }
  .pb-section-btn--danger { border-color: #fecdd3; color: #be123c; }
  .pb-section-btn--danger:hover { background: #fff1f2; }

  .pb-errors {
    margin: 10px 14px;
    padding: 10px 12px;
    border-radius: 8px;
    background: #fff1f2;
    border: 1px solid #fecdd3;
    font-size: 12px;
    color: #be123c;
  }
  .pb-errors-title { font-weight: 700; margin-bottom: 4px; }
  .pb-errors-list { padding-left: 16px; margin: 0; }
  .pb-errors-list li { margin: 2px 0; }

  /* ── BANNER ── */
  .pb-banner {
    border-radius: 10px;
    border: 1px solid #fde68a;
    background: #fffbeb;
    padding: 14px 16px;
    margin-bottom: 16px;
  }
  .pb-banner-title { font-size: 13px; font-weight: 600; color: #92400e; }
  .pb-banner-sub   { font-size: 12px; color: #a16207; margin-top: 2px; }
  .pb-banner-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }

  /* ── ERR ── */
  .pb-err {
    border-radius: 10px;
    border: 1px solid #fecdd3;
    background: #fff1f2;
    padding: 12px 16px;
    font-size: 13px;
    color: #be123c;
    margin-bottom: 16px;
  }

  /* ── EMPTY STATE ── */
  .pb-empty {
    text-align: center;
    padding: 40px 20px;
    color: #a8a29e;
  }
  .pb-empty-icon { font-size: 32px; margin-bottom: 10px; }
  .pb-empty-title { font-size: 14px; font-weight: 600; color: #78716c; }
  .pb-empty-sub { font-size: 12.5px; margin-top: 4px; }

  /* ── LOADING ── */
  .pb-loading {
    display: flex; align-items: center; gap: 10px;
    color: #78716c; font-size: 14px; padding: 40px 0;
  }
  @keyframes pb-spin { to { transform: rotate(360deg); } }
  .pb-spinner {
    width: 18px; height: 18px;
    border: 2px solid #e7e5e4;
    border-top-color: #78716c;
    border-radius: 50%;
    animation: pb-spin .6s linear infinite;
    flex-shrink: 0;
  }

  /* ── DIVIDER ── */
  .pb-divider { height: 1px; background: #f5f5f4; margin: 14px 0; }

  /* ── AUTOSAVE ── */
  .pb-autosave {
    font-size: 11.5px; color: #a8a29e; font-weight: 500;
  }

  /* ── SECTION GRID ── */
  .pb-section-inner { display: grid; grid-template-columns: 1fr; gap: 12px; }
  @media (min-width: 768px) { .pb-section-inner { grid-template-columns: 200px 1fr; } }

  /* SIDEBAR RIGHT */
  .pb-sidebar {
    display: flex; flex-direction: column; gap: 14px;
  }
  @media (min-width: 1024px) {
    .pb-sidebar { position: sticky; top: 72px; max-height: calc(100vh - 88px); overflow-y: auto; scrollbar-width: none; }
    .pb-sidebar::-webkit-scrollbar { display: none; }
  }

  .pb-main { min-width: 0; }

  /* Scrollbar util */
  .pb-sections-list { display: flex; flex-direction: column; gap: 8px; }
`;

/* ────────────────────────────────── types ── */
type SeoLevel = "good" | "warn" | "bad";
type UiSection = { sectionKey: string; type: string; sortOrder: number; dataJson: string };

/* ────────────────────────────────── seo helpers ── */
function seoCls(level: SeoLevel) {
  return `pb-seo-pill pb-seo-pill--${level}`;
}
function SeoBadge({ level, text }: { level: SeoLevel; text: string }) {
  const dot = level === "good" ? "✓" : level === "warn" ? "!" : "✕";
  return (
    <span className={seoCls(level)}>
      <span className="pb-seo-dot">{dot}</span>
      <span>{text}</span>
    </span>
  );
}
function normalizeSlugHint(slug: string) {
  return (slug || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
function titleSeo(v: string) {
  const len = (v || "").trim().length;
  if (len === 0) return { level: "bad" as SeoLevel, msg: "Falta metaTitle" };
  if (len > 70) return { level: "bad" as SeoLevel, msg: `Muy largo (${len}) — ideal 45–60` };
  if (len < 30) return { level: "bad" as SeoLevel, msg: `Muy corto (${len}) — ideal 45–60` };
  if (len < 45) return { level: "warn" as SeoLevel, msg: `Aceptable (${len}) — ideal 45–60` };
  if (len > 60) return { level: "warn" as SeoLevel, msg: `Un poco largo (${len})` };
  return { level: "good" as SeoLevel, msg: `Perfecto (${len})` };
}
function descSeo(v: string) {
  const len = (v || "").trim().length;
  if (len === 0) return { level: "bad" as SeoLevel, msg: "Falta metaDescription" };
  if (len > 200) return { level: "bad" as SeoLevel, msg: `Muy larga (${len}) — ideal 140–160` };
  if (len < 110) return { level: "bad" as SeoLevel, msg: `Muy corta (${len}) — ideal 140–160` };
  if (len < 140) return { level: "warn" as SeoLevel, msg: `Aceptable (${len})` };
  if (len > 160) return { level: "warn" as SeoLevel, msg: `Un poco larga (${len})` };
  return { level: "good" as SeoLevel, msg: `Perfecta (${len})` };
}
function slugSeo(slug: string) {
  const raw = (slug || "").trim();
  const clean = normalizeSlugHint(raw);
  if (!raw) return { level: "bad" as SeoLevel, msg: "Falta slug" };
  if (/[^a-zA-Z0-9-_ ]/.test(raw)) return { level: "bad" as SeoLevel, msg: "Caracteres inválidos" };
  if (/\s/.test(raw)) return { level: "bad" as SeoLevel, msg: "Tiene espacios (usa guiones)" };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(clean)) return { level: "warn" as SeoLevel, msg: `Se normalizará: ${clean || "—"}` };
  if (clean.length < 3) return { level: "warn" as SeoLevel, msg: `Muy corto (${clean.length})` };
  if (clean.length > 80) return { level: "warn" as SeoLevel, msg: `Muy largo (${clean.length})` };
  return { level: "good" as SeoLevel, msg: `OK (${clean.length})` };
}
function ogSeo(v: string) {
  const s = (v || "").trim();
  if (!s) return { level: "warn" as SeoLevel, msg: "Recomendado (1200×630)" };
  if (!/^https?:\/\//i.test(s)) return { level: "bad" as SeoLevel, msg: "Debe iniciar con https://" };
  return { level: "good" as SeoLevel, msg: "OK — 1200×630 ideal" };
}
function seoOverall(levels: SeoLevel[]): SeoLevel {
  if (levels.includes("bad")) return "bad";
  if (levels.includes("warn")) return "warn";
  return "good";
}

/* ────────────────────────────────── section validation ── */
function safeJson(json: string) {
  try { const v = JSON.parse(json || "{}"); return v && typeof v === "object" ? v : {}; } catch { return null; }
}
function isNonEmptyString(v: any) { return typeof v === "string" && v.trim().length > 0; }

function validateSection(typeRaw: string, dataJson: string): string[] {
  const type = (typeRaw || "").trim().toLowerCase();
  const obj = safeJson(dataJson);
  if (obj === null) return ["JSON inválido"];
  const arr = (v: any) => (Array.isArray(v) ? v : []);
  const errs: string[] = [];

  if (type === "hero") { if (!isNonEmptyString((obj as any).title)) errs.push("Falta title"); }
  if (type === "text") { if (!isNonEmptyString((obj as any).text)) errs.push("Falta text"); }
  if (type === "cta") {
    if (!isNonEmptyString((obj as any).title)) errs.push("Falta title");
    if (!isNonEmptyString((obj as any).ctaText)) errs.push("Falta ctaText");
    if (!isNonEmptyString((obj as any).ctaHref)) errs.push("Falta ctaHref");
  }
  if (type === "imagetext") {
    if (!isNonEmptyString((obj as any).text)) errs.push("Falta text");
    if (!isNonEmptyString((obj as any).imageUrl)) errs.push("Falta imageUrl");
  }
  if (type === "videotext") {
    const hasTitle = isNonEmptyString((obj as any).title);
    const hasSubtitle = isNonEmptyString((obj as any).subtitle);
    const hasText = isNonEmptyString((obj as any).text);
    const hasCtaText = isNonEmptyString((obj as any).ctaText);
    const hasCtaHref = isNonEmptyString((obj as any).ctaHref);
    if (!hasTitle && !hasSubtitle && !hasText) errs.push("Falta contenido: usa title, subtitle o text");
    if (!isNonEmptyString((obj as any).videoUrl)) errs.push("Falta videoUrl");
    if (hasCtaText && !hasCtaHref) errs.push("Si usas ctaText, falta ctaHref");
    if (!hasCtaText && hasCtaHref) errs.push("Si usas ctaHref, falta ctaText");
  }
  if (type === "features") {
    const items = arr((obj as any).items);
    if (!items.length) errs.push("items[] vacío");
    items.forEach((it: any, i: number) => {
      if (!isNonEmptyString(it?.title)) errs.push(`items[${i}].title falta`);
      if (!isNonEmptyString(it?.text)) errs.push(`items[${i}].text falta`);
    });
  }
  if (type === "stats") {
    const items = arr((obj as any).items);
    if (!items.length) errs.push("items[] vacío");
    items.forEach((it: any, i: number) => {
      if (!isNonEmptyString(it?.value)) errs.push(`items[${i}].value falta`);
      if (!isNonEmptyString(it?.label)) errs.push(`items[${i}].label falta`);
    });
  }
  if (type === "faq") {
    const items = arr((obj as any).items);
    if (!items.length) errs.push("items[] vacío");
    items.forEach((it: any, i: number) => {
      if (!isNonEmptyString(it?.question)) errs.push(`items[${i}].question falta`);
      if (!isNonEmptyString(it?.answer)) errs.push(`items[${i}].answer falta`);
    });
  }
  if (type === "testimonials") {
    const items = arr((obj as any).items);
    if (!items.length) errs.push("items[] vacío");
    items.forEach((it: any, i: number) => {
      if (!isNonEmptyString(it?.name)) errs.push(`items[${i}].name falta`);
      if (!isNonEmptyString(it?.text)) errs.push(`items[${i}].text falta`);
    });
  }
  if (type === "logos") {
    const logos = arr((obj as any).logos);
    if (!logos.length) errs.push("logos[] vacío");
    logos.forEach((it: any, i: number) => { if (!isNonEmptyString(it?.imageUrl)) errs.push(`logos[${i}].imageUrl falta`); });
  }
  if (type === "carousel") {
    const items = arr((obj as any).items);
    if (!items.length) errs.push("items[] vacío");
    items.forEach((it: any, i: number) => { if (!isNonEmptyString(it?.imageUrl)) errs.push(`items[${i}].imageUrl falta`); });
  }
  if (type === "pricing") {
    const plans = arr((obj as any).plans);
    if (!plans.length) errs.push("plans[] vacío");
    plans.forEach((p: any, i: number) => {
      if (!isNonEmptyString(p?.name)) errs.push(`plans[${i}].name falta`);
      if (!isNonEmptyString(p?.price)) errs.push(`plans[${i}].price falta`);
    });
  }
  if (type === "spacer") {
    if (typeof (obj as any).size !== "number") errs.push("size debe ser número");
  }
  return errs;
}

/* ────────────────────────────────── section type metadata ── */
const SECTION_META: Record<string, { icon: string; label: string }> = {
  hero:            { icon: "🏠", label: "Hero" },
  text:            { icon: "📝", label: "Texto" },
  imageText:       { icon: "🖼", label: "Imagen + Texto" },
  videoText:       { icon: "▶️", label: "Video + Texto" },
  features:        { icon: "✦", label: "Features" },
  stats:           { icon: "📊", label: "Stats" },
  logos:           { icon: "🏷", label: "Logos" },
  faq:             { icon: "❓", label: "FAQ" },
  testimonials:    { icon: "💬", label: "Testimonios" },
  pricing:         { icon: "💳", label: "Pricing" },
  carousel:        { icon: "🎠", label: "Carousel" },
  divider:         { icon: "─", label: "Divider" },
  spacer:          { icon: "↕", label: "Spacer" },
  cta:             { icon: "📣", label: "CTA" },
  heroMedia:       { icon: "🎬", label: "Hero Media" },
  herocarousel:       { icon: "▶️🎬", label: "Hero Carrusel" },
  productsGrid:    { icon: "🛒", label: "Productos" },
  cardsGrid:       { icon: "▦", label: "Cards Grid" },
  ctaSplit:        { icon: "⚡", label: "CTA Split" },
  pricingTabs:     { icon: "🗂", label: "Pricing Tabs" },
  contactForm:     { icon: "✉️", label: "Formulario" },
  contactFormSplit: { icon: "📬", label: "Form Split" },
};

/* ────────────────────────────────── helpers ── */
function uniqueSectionKey(base: string) {
  const clean = (base || "sec").toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  return `${clean}_${String(Date.now()).slice(-6)}`;
}
function reindex(next: UiSection[]) {
  return next.map((s, i) => ({ ...s, sortOrder: i + 1 }));
}
function draftKey(pageId: number) { return `awcmr_draft_page_${pageId}`; }
function makeSnapshot(input: { slug: string; metaTitle: string; metaDescription: string; ogImage: string; status: string; sections: UiSection[] }) {
  const canonSections = reindex(input.sections).map((s) => ({ sectionKey: s.sectionKey, type: s.type, dataJson: s.dataJson ?? "{}" }));
  return JSON.stringify({ slug: input.slug || "", metaTitle: input.metaTitle || "", metaDescription: input.metaDescription || "", ogImage: input.ogImage || "", status: input.status || "draft", sections: canonSections });
}

/* ────────────────────────────────── SortableSectionCard ── */
function SortableSectionCard(props: {
  section: UiSection; index: number; errors: string[]; sectionTypes: string[];
  onMoveUp: () => void; onMoveDown: () => void; onDuplicate: () => void; onRemove: () => void;
  onChangeType: (type: string) => void; onChangeDataJson: (dataJson: string) => void;
}) {
  const { section, index, errors, sectionTypes, onMoveUp, onMoveDown, onDuplicate, onRemove, onChangeType, onChangeDataJson } = props;
  const ok = errors.length === 0;
  const meta = SECTION_META[section.type] ?? { icon: "◻", label: section.type };

  const { setNodeRef, setActivatorNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: section.sectionKey });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`pb-section-card${isDragging ? " pb-section-card--dragging" : ""}`}>
      {/* Card header */}
      <div className="pb-section-card-head">
        <div className="pb-section-meta">
          {/* Drag handle */}
          <button ref={setActivatorNodeRef} {...attributes} {...listeners} type="button" className="pb-drag-handle" title="Arrastrar para reordenar" aria-label="Arrastrar">
            ⠿
          </button>
          <span className="pb-section-index">#{index + 1}</span>
          <span className="pb-section-type">{meta.icon} {meta.label}</span>
          <span className={`pb-section-ok ${ok ? "pb-section-ok--ok" : "pb-section-ok--err"}`}>
            {ok ? "✓ OK" : `${errors.length} error${errors.length > 1 ? "es" : ""}`}
          </span>
        </div>

        <div className="pb-section-actions">
          <button className="pb-section-btn" onClick={onMoveUp} type="button" title="Subir">↑</button>
          <button className="pb-section-btn" onClick={onMoveDown} type="button" title="Bajar">↓</button>
          <button className="pb-section-btn" onClick={onDuplicate} type="button" title="Duplicar">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 9H2a1 1 0 01-1-1V2a1 1 0 011-1h6a1 1 0 011 1v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          </button>
          <button className="pb-section-btn pb-section-btn--danger" onClick={onRemove} type="button" title="Eliminar">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Errors */}
      {!ok && (
        <div className="pb-errors">
          <div className="pb-errors-title">Errores en esta sección</div>
          <ul className="pb-errors-list">
            {errors.slice(0, 6).map((e, i) => <li key={i}>{e}</li>)}
          </ul>
          {errors.length > 6 && <div style={{ marginTop: 4, opacity: .7 }}>… y {errors.length - 6} más</div>}
        </div>
      )}

      {/* Body */}
      <div className="pb-section-card-body">
        <div className="pb-section-inner">
          <div>
            <label className="pb-label">Tipo</label>
            <select className="pb-select" value={section.type} onChange={(e) => onChangeType(e.target.value)}>
              {sectionTypes.map((t) => {
                const m = SECTION_META[t] ?? { icon: "", label: t };
                return <option key={t} value={t}>{m.icon} {m.label}</option>;
              })}
            </select>
          </div>
          <div>
            <SectionForm type={section.type} dataJson={section.dataJson} onChangeDataJson={onChangeDataJson} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────── Main component ── */
export default function AdminPageEditor() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [sections, setSections] = useState<UiSection[]>([]);

  const [hasLocalDraft, setHasLocalDraft] = useState(false);
  const [localDraftTs, setLocalDraftTs] = useState<number | null>(null);
  const [lastAutosaveTs, setLastAutosaveTs] = useState<number | null>(null);
  const serverSnapshotRef = useRef<string>("");
  const [dirty, setDirty] = useState(false);

  const sectionTypes = useMemo(() => [
    "hero","text","imageText","videoText","features","stats","logos","faq",
    "testimonials","pricing","carousel","divider","spacer","cta","heroMedia","heroCarousel",
    "productsGrid","cardsGrid","ctaSplit","pricingTabs","contactForm","contactFormSplit",
  ], []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  /* Load */
  useEffect(() => {
    if (!id || Number.isNaN(id)) { setErr("ID inválido."); setLoading(false); return; }
    (async () => {
      try {
        setErr(null); setLoading(true);
        const data = await adminGetPage(id);
        setSlug(data.page.slug || ""); setMetaTitle(data.page.metaTitle || "");
        setMetaDescription(data.page.metaDescription || ""); setOgImage(data.page.ogImage || "");
        setStatus(data.page.status || "draft");
        const sorted = [...(data.sections || [])].sort((a, b) => a.sortOrder - b.sortOrder);
        setSections(sorted);
        const snap = makeSnapshot({ slug: data.page.slug || "", metaTitle: data.page.metaTitle || "", metaDescription: data.page.metaDescription || "", ogImage: data.page.ogImage || "", status: data.page.status || "draft", sections: sorted });
        serverSnapshotRef.current = snap; setDirty(false);
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem(draftKey(id));
          if (raw) { try { const p = JSON.parse(raw); if (p?.ts && p?.state) { setHasLocalDraft(true); setLocalDraftTs(Number(p.ts)); } } catch {} }
        }
      } catch (e: any) { setErr(e.message || "Error cargando página"); } finally { setLoading(false); }
    })();
  }, [id]);

  /* Dirty */
  useEffect(() => {
    if (loading) return;
    const current = makeSnapshot({ slug, metaTitle, metaDescription, ogImage, status, sections });
    setDirty(current !== serverSnapshotRef.current);
  }, [slug, metaTitle, metaDescription, ogImage, status, sections, loading]);

  /* beforeunload */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (!dirty) return; e.preventDefault(); e.returnValue = ""; };
    if (dirty) window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  /* Autosave */
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      if (!dirty) return;
      try {
        const state = { slug, metaTitle, metaDescription, ogImage, status, sections: reindex(sections) };
        localStorage.setItem(draftKey(id), JSON.stringify({ ts: Date.now(), state }));
        setHasLocalDraft(true); setLocalDraftTs(Date.now()); setLastAutosaveTs(Date.now());
      } catch {}
    }, 8000);
    return () => clearInterval(interval);
  }, [dirty, slug, metaTitle, metaDescription, ogImage, status, sections, id, loading]);

  function restoreLocalDraft() {
    try {
      const raw = localStorage.getItem(draftKey(id)); if (!raw) return;
      const parsed = JSON.parse(raw); const st = parsed?.state; if (!st) return;
      setSlug(st.slug || ""); setMetaTitle(st.metaTitle || ""); setMetaDescription(st.metaDescription || "");
      setOgImage(st.ogImage || ""); setStatus(st.status || "draft");
      setSections(Array.isArray(st.sections) ? st.sections : []);
      setHasLocalDraft(true); setLocalDraftTs(Number(parsed.ts) || Date.now());
    } catch {}
  }

  function discardLocalDraft() {
    try { localStorage.removeItem(draftKey(id)); } catch {}
    setHasLocalDraft(false); setLocalDraftTs(null);
  }

  function moveButtons(idx: number, dir: -1 | 1) {
    const target = idx + dir; if (target < 0 || target >= sections.length) return;
    const next = [...sections]; const tmp = next[idx]; next[idx] = next[target]; next[target] = tmp;
    setSections(reindex(next));
  }
  function addSection(type: string) {
    setSections([...sections, { sectionKey: uniqueSectionKey(type), type, sortOrder: sections.length + 1, dataJson: "{}" }]);
  }
  function duplicateSection(idx: number) {
    const current = sections[idx]; if (!current) return;
    const copy: UiSection = { sectionKey: uniqueSectionKey(current.sectionKey + "_copy"), type: current.type, sortOrder: current.sortOrder + 1, dataJson: current.dataJson || "{}" };
    setSections(reindex([...sections.slice(0, idx + 1), copy, ...sections.slice(idx + 1)]));
  }
  function removeSection(idx: number) { setSections(reindex(sections.filter((_, i) => i !== idx))); }
  function updateSection(idx: number, patch: Partial<UiSection>) {
    const next = [...sections]; next[idx] = { ...next[idx], ...patch }; setSections(next);
  }
  function onDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id); const overId = event.over ? String(event.over.id) : null;
    if (!overId || activeId === overId) return;
    const oldIndex = sections.findIndex((s) => s.sectionKey === activeId);
    const newIndex = sections.findIndex((s) => s.sectionKey === overId);
    if (oldIndex === -1 || newIndex === -1) return;
    setSections(reindex(arrayMove(sections, oldIndex, newIndex)));
  }

  async function onSave() {
    try {
      setSaving(true); setErr(null);
      const allErrors: Array<{ idx: number; key: string; type: string; errors: string[] }> = [];
      sections.forEach((s, i) => { const errors = validateSection(s.type, s.dataJson); if (errors.length) allErrors.push({ idx: i, key: s.sectionKey, type: s.type, errors }); });
      if (allErrors.length) {
        const first = allErrors[0];
        throw new Error(`No se puede guardar. Errores en sección #${first.idx + 1} (${first.type}): ${first.errors.join(", ")}`);
      }
      await adminUpdatePage(id, { slug, metaTitle, metaDescription, ogImage, status, sections: reindex(sections) });
      serverSnapshotRef.current = makeSnapshot({ slug, metaTitle, metaDescription, ogImage, status, sections });
      setDirty(false);
      alert("Guardado OK");
      router.refresh();
    } catch (e: any) { setErr(e.message || "Error guardando"); } finally { setSaving(false); }
  }

  async function onDelete() {
    const ok = confirm("¿Seguro que deseas eliminar esta página? Esta acción no se puede deshacer.");
    if (!ok) return;
    try {
      setErr(null);
      await adminDeletePage(id);
      alert("Eliminada");
      router.replace("/admin/pages");
    } catch (e: any) { setErr(e.message || "Error eliminando"); }
  }

  if (loading) return (
    <div className="pb-root">
      <style>{PAGE_STYLES}</style>
      <div className="pb-loading"><div className="pb-spinner" /> Cargando página…</div>
    </div>
  );

  const sectionIds = sections.map((s) => s.sectionKey);
  function fmtTs(ts: number | null) {
    if (!ts) return "";
    return new Intl.DateTimeFormat("es-PE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(ts));
  }

  /* SEO calcs */
  const t = titleSeo(metaTitle); const d = descSeo(metaDescription);
  const s = slugSeo(slug); const o = ogSeo(ogImage);
  const overall = seoOverall([t.level, d.level, s.level, o.level]);
  const cleanSlug = normalizeSlugHint(slug || "");
  const previewTitle = (metaTitle || "").trim() || "Título de la página";
  const previewDesc = (metaDescription || "").trim() || "Aquí aparecerá tu descripción en Google.";
  const previewUrl = `https://tu-dominio.pe/${cleanSlug || "slug"}`;
  const totalErrors = sections.reduce((acc, sec) => acc + validateSection(sec.type, sec.dataJson).length, 0);

  return (
    <div className="pb-root">
      <style>{PAGE_STYLES}</style>

      {/* ── TOPBAR ── */}
      <div className="pb-topbar">
        <div>
          <div className="pb-page-title">
            {metaTitle.trim() || `Página sin título`}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
            <span className="pb-page-id">ID {id}</span>
            <span style={{ color: "#d4d0cb" }}>·</span>
            {dirty ? (
              <span className="pb-pill pb-pill--dirty">
                <span className="pb-pill-dot pb-pill-dot--dirty" />Cambios sin guardar
              </span>
            ) : (
              <span className="pb-pill pb-pill--saved">
                <span className="pb-pill-dot pb-pill-dot--saved" />Guardado
              </span>
            )}
            {status === "published" ? (
              <span className="pb-pill pb-pill--pub">
                <span className="pb-pill-dot pb-pill-dot--pub" />Publicado
              </span>
            ) : (
              <span className="pb-pill pb-pill--draft">
                <span className="pb-pill-dot pb-pill-dot--draft" />Borrador
              </span>
            )}
            {lastAutosaveTs && (
              <span className="pb-autosave">Autosave {fmtTs(lastAutosaveTs)}</span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <a className="pb-btn" href="/admin/pages">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 10.5L3.5 6.5 8 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Volver
          </a>
          <a
            className={`pb-btn${!slug.trim() ? " pb-btn--disabled" : ""}`}
            href={`/${slug.trim()}`}
            target="_blank" rel="noreferrer"
            title={slug.trim() ? "Ver página pública" : "Primero define un slug"}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7M8 1h3m0 0v3m0-3L5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Ver
          </a>
          <a
            className={`pb-btn${!slug.trim() ? " pb-btn--disabled" : ""}`}
            href={`/preview/${slug.trim()}`}
            target="_blank" rel="noreferrer"
            title={slug.trim() ? "Preview en draft" : "Primero define un slug"}
          >
            Preview
          </a>
          <button className="pb-btn pb-btn--danger" onClick={onDelete} type="button">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M5 1h2M4.5 3v7.5M7.5 3v7.5M1.5 3l.8 7.2A1 1 0 003.3 11h5.4a1 1 0 001-.8L10.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Eliminar
          </button>
          <button className="pb-btn pb-btn--primary" onClick={onSave} disabled={saving} type="button">
            {saving ? (
              <>
                <span style={{ display:"inline-block", width:12, height:12, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"pb-spin .6s linear infinite" }}/>
                Guardando…
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 7l3.5 3.5L11 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Guardar
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── DRAFT BANNER ── */}
      {hasLocalDraft && (
        <div className="pb-banner">
          <div className="pb-banner-title">
            💾 Hay un borrador local guardado{localDraftTs ? ` — ${fmtTs(localDraftTs)}` : ""}
          </div>
          <div className="pb-banner-sub">Este borrador existe solo en este navegador/PC.</div>
          <div className="pb-banner-actions">
            <button className="pb-btn" type="button" onClick={restoreLocalDraft}>Restaurar borrador</button>
            <button className="pb-btn pb-btn--danger" type="button" onClick={discardLocalDraft}>Descartar</button>
          </div>
        </div>
      )}

      {/* ── ERROR ── */}
      {err && <div className="pb-err">⚠ {err}</div>}

      {/* ── MAIN LAYOUT ── */}
      <div className="pb-layout" style={{ gap: 16 }}>

        {/* ── LEFT: Sections ── */}
        <div className="pb-main">
          <div className="pb-panel">
            <div className="pb-panel-head">
              <span className="pb-panel-title">Secciones</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {sections.length > 0 && (
                  <span style={{ fontSize: 12, color: "#a8a29e", fontWeight: 500 }}>
                    {sections.length} sección{sections.length !== 1 ? "es" : ""}
                    {totalErrors > 0 && <span style={{ color: "#be123c", marginLeft: 6 }}>· {totalErrors} error{totalErrors !== 1 ? "es" : ""}</span>}
                  </span>
                )}
              </div>
            </div>

            <div style={{ padding: sections.length ? "14px" : 0 }}>
              {!sections.length ? (
                <div className="pb-empty">
                  <div className="pb-empty-icon">◻</div>
                  <div className="pb-empty-title">Sin secciones</div>
                  <div className="pb-empty-sub">Agrega secciones desde el panel lateral →</div>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
                  <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
                    <div className="pb-sections-list">
                      {sections.map((sec, idx) => {
                        const errors = validateSection(sec.type, sec.dataJson);
                        return (
                          <SortableSectionCard
                            key={sec.sectionKey}
                            section={sec} index={idx} errors={errors} sectionTypes={sectionTypes}
                            onMoveUp={() => moveButtons(idx, -1)}
                            onMoveDown={() => moveButtons(idx, 1)}
                            onDuplicate={() => duplicateSection(idx)}
                            onRemove={() => removeSection(idx)}
                            onChangeType={(type) => updateSection(idx, { type })}
                            onChangeDataJson={(dataJson) => updateSection(idx, { dataJson })}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="pb-sidebar">

          {/* ── Add Section ── */}
          <div className="pb-panel">
            <div className="pb-panel-head">
              <span className="pb-panel-title">Agregar sección</span>
            </div>
            <div className="pb-panel-body">
              <p style={{ fontSize: 12, color: "#a8a29e", marginBottom: 0 }}>
                Se agrega al final. Arrastra para reordenar.
              </p>
              <div className="pb-types-grid">
                {sectionTypes.map((type) => {
                  const m = SECTION_META[type] ?? { icon: "◻", label: type };
                  return (
                    <button key={type} className="pb-type-btn" onClick={() => addSection(type)} type="button">
                      <span className="pb-type-icon">{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Meta & SEO ── */}
          <div className="pb-panel">
            <div className="pb-panel-head">
              <span className="pb-panel-title">Meta & SEO</span>
              <SeoBadge level={overall} text={overall === "good" ? "Listo" : overall === "warn" ? "Mejorable" : "Incompleto"} />
            </div>
            <div className="pb-panel-body">

              {/* SEO pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                <SeoBadge level={t.level} text={`Title: ${t.msg}`} />
                <SeoBadge level={d.level} text={`Desc: ${d.msg}`} />
                <SeoBadge level={s.level} text={`Slug: ${s.msg}`} />
                <SeoBadge level={o.level} text={`OG: ${o.msg}`} />
              </div>

              {/* Google preview */}
              <div className="pb-google-preview">
                <div className="pb-gp-label">Vista previa — Google</div>
                <div className="pb-gp-title">{previewTitle}</div>
                <div className="pb-gp-url">{previewUrl}</div>
                <div className="pb-gp-desc">{previewDesc}</div>
              </div>

              {slug && cleanSlug !== slug.trim() && (
                <div style={{ fontSize: 11.5, color: "#b45309", marginTop: 10, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 7, padding: "7px 10px" }}>
                  💡 Slug sugerido: <strong>{cleanSlug}</strong>
                </div>
              )}

              <div className="pb-divider" />

              {/* Fields */}
              <div className="pb-field">
                <label className="pb-label">Slug</label>
                <input className="pb-input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="mi-pagina" />
              </div>
              <div className="pb-field">
                <label className="pb-label">Meta Title</label>
                <input className="pb-input" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Título para SEO (45–60 caracteres)" />
              </div>
              <div className="pb-field">
                <label className="pb-label">Meta Description</label>
                <textarea className="pb-textarea" rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Descripción para Google (140–160 caracteres)" />
              </div>
              <div className="pb-field">
                <label className="pb-label">OG Image (URL)</label>
                <input className="pb-input" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://... (ideal 1200×630)" />
              </div>
              <div className="pb-field">
                <label className="pb-label">Status</label>
                <select className="pb-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="draft">📝 Borrador</option>
                  <option value="published">🌐 Publicado</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}