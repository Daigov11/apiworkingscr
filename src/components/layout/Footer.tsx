import React from "react";

type FooterSocial = { href: string; type: string };
type FooterColumnLink = { href: string; label: string };
type FooterColumn = { title: string; links: FooterColumnLink[] };
type FooterData = { note?: string | null; social?: FooterSocial[]; columns?: FooterColumn[] };

async function getFooterData(): Promise<FooterData> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/layout/footer`, { method: "GET", cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as FooterData;
  } catch {
    return { note: "© ApiWorking", social: [], columns: [] };
  }
}

function socialLabel(type: string) {
  const map: Record<string, string> = { whatsapp: "WhatsApp", facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube" };
  return map[type] ?? type;
}

function SocialIcon({ type }: { type: string }) {
  const cls = "ft-si";
  switch (type) {
    case "whatsapp":
      return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.114.554 4.1 1.524 5.82L0 24l6.336-1.502A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.796 9.796 0 01-5.006-1.371l-.36-.214-3.732.884.944-3.617-.235-.372A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>;
    case "instagram":
      return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
    case "facebook":
      return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>;
    case "tiktok":
      return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/></svg>;
    case "youtube":
      return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>;
    default:
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>;
  }
}

export default async function Footer() {
  const data = await getFooterData();
  const columns = Array.isArray(data?.columns) ? data.columns : [];
  const social  = Array.isArray(data?.social)  ? data.social  : [];

  return (
    <>
      <style>{STYLES}</style>
      <footer className="ft-root">
        <div className="ft-topbar" />

        <div className="ft-body">
          <div className="ft-inner">
            <div className="ft-brand">
              <div className="ft-logo">
                <span className="ft-logo-mark">A</span>
                <span className="ft-logo-name">ApiWorking</span>
              </div>
              <p className="ft-tagline">Sistemas para negocios en Perú</p>
              {social.length > 0 && (
                <div className="ft-social">
                  {social.map((item, i) => (
                    <a key={`${item.href}-${i}`} href={item.href} target="_blank" rel="noreferrer noopener" aria-label={socialLabel(item.type)} className="ft-social-link">
                      <SocialIcon type={item.type} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {columns.length > 0 && (
              <div className="ft-cols">
                {columns.map((col, i) => (
                  <div key={`${col.title}-${i}`} className="ft-col">
                    <div className="ft-col-title">{col.title}</div>
                    <ul className="ft-col-links">
                      {(col.links ?? []).map((link) => (
                        <li key={`${link.href}-${link.label}`}>
                          <a href={link.href} className="ft-link">{link.label}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="ft-bottom">
          <div className="ft-bottom-inner">
            <small className="ft-note">{data?.note || "© ApiWorking"}</small>
            <div className="ft-accent-dots">
              <span className="ft-adot" /><span className="ft-adot ft-adot--lime" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,800&display=swap');

  :root {
    --ft-green: #50B36D; --ft-lime: #8BCB2E;
    --ft-dark: #222322; --ft-mid: #5F6661;
    --ft-bg: #FFFFFF; --ft-soft: #F5FBF6; --ft-border: #DCEEDF;
  }

  .ft-root { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--ft-soft); color: var(--ft-dark); border-top: 1.5px solid var(--ft-border); }
  .ft-topbar { height: 4px; background: linear-gradient(to right, var(--ft-green), var(--ft-lime)); }
  .ft-body { padding: 56px 0 40px; }
  .ft-inner { max-width: 1280px; margin: 0 auto; padding: 0 40px; display: flex; gap: 64px; flex-wrap: wrap; justify-content: space-between; }
  @media (max-width: 640px) { .ft-inner { padding: 0 20px; gap: 40px; } }

  .ft-brand { display: flex; flex-direction: column; max-width: 260px; }
  .ft-logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .ft-logo-mark { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, var(--ft-green), var(--ft-lime)); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-weight: 800; font-style: italic; font-size: 17px; color: #fff; box-shadow: 0 4px 14px rgba(80,179,109,0.35); flex-shrink: 0; }
  .ft-logo-name { font-family: 'Fraunces', serif; font-weight: 800; font-size: 18px; color: var(--ft-dark); letter-spacing: -0.02em; }
  .ft-tagline { font-size: 13px; color: var(--ft-mid); line-height: 1.6; margin: 0 0 20px; }
  .ft-social { display: flex; gap: 8px; flex-wrap: wrap; }
  .ft-social-link { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid var(--ft-border); background: var(--ft-bg); display: flex; align-items: center; justify-content: center; color: var(--ft-mid); text-decoration: none; transition: border-color .18s, background .18s, color .18s, transform .18s; }
  .ft-social-link:hover { border-color: var(--ft-green); background: rgba(80,179,109,.08); color: var(--ft-green); transform: translateY(-2px); }
  .ft-si { width: 15px; height: 15px; flex-shrink: 0; }

  .ft-cols { display: flex; gap: 48px; flex-wrap: wrap; }
  .ft-col { display: flex; flex-direction: column; min-width: 140px; }
  .ft-col-title { font-size: 11.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--ft-dark); margin-bottom: 16px; position: relative; padding-bottom: 10px; }
  .ft-col-title::after { content: ''; position: absolute; bottom: 0; left: 0; width: 24px; height: 2px; border-radius: 1px; background: linear-gradient(to right, var(--ft-green), var(--ft-lime)); }
  .ft-col-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .ft-link { font-size: 13.5px; font-weight: 500; color: var(--ft-mid); text-decoration: none; transition: color .18s, padding-left .18s; display: inline-block; }
  .ft-link:hover { color: var(--ft-green); padding-left: 4px; }

  .ft-bottom { border-top: 1px solid var(--ft-border); }
  .ft-bottom-inner { max-width: 1280px; margin: 0 auto; padding: 16px 40px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  @media (max-width: 640px) { .ft-bottom-inner { padding: 14px 20px; flex-direction: column; gap: 8px; } }
  .ft-note { font-size: 12px; color: var(--ft-mid); }
  .ft-accent-dots { display: flex; gap: 5px; align-items: center; }
  .ft-adot { width: 6px; height: 6px; border-radius: 50%; background: var(--ft-green); }
  .ft-adot--lime { background: var(--ft-lime); }
`;