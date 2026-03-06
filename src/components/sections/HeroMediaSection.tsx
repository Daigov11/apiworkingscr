import Link from "next/link";

type HeroMediaData = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;

  badges?: string[];

  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };

  mediaType?: "image" | "video";
  mediaUrl?: string;
  mediaAlt?: string;

  includesTitle?: string;
  includesText?: string;
  includesImages?: Array<{ imageUrl: string; alt?: string }>;
};

function isHttpUrl(u?: string) {
  if (!u) return false;
  return /^https?:\/\//i.test(u);
}

export default function HeroMediaSection({ data }: { data: any }) {
  const d = (data || {}) as HeroMediaData;

  const eyebrow = d.eyebrow || "Soluciones para negocios en Perú";
  const title = d.title || "El mejor sistema para tu negocio";
  const subtitle = d.subtitle || "Gestión, ventas y operaciones en un solo lugar.";

  const badges = Array.isArray(d.badges) ? d.badges.slice(0, 6) : [];

  const primary = d.primaryCta?.text
    ? d.primaryCta
    : { text: "Solicitar demo", href: "/contacto" };

  const secondary = d.secondaryCta?.text
    ? d.secondaryCta
    : { text: "Ver productos", href: "/productos" };

  const mediaType = d.mediaType === "video" ? "video" : "image";
  const mediaUrl = d.mediaUrl || "";
  const mediaAlt = d.mediaAlt || title;

  const includesTitle = d.includesTitle || "Tu sistema incluye";
  const includesText =
    d.includesText || "Pagos QR, facturación y módulos listos para operar.";

  const includesImages = Array.isArray(d.includesImages)
    ? d.includesImages.slice(0, 5)
    : [];

  return (
    <section className="relative overflow-hidden bg-[#f8fafc]">
      <div className="absolute inset-y-0 right-0 hidden w-[42%] lg:block">
        <div className="absolute right-[-12%] top-1/2 h-[120%] w-full -translate-y-1/2 rounded-l-[120px] bg-gradient-to-br from-sky-200/80 via-cyan-100/50 to-transparent" />
      </div>

      <div className="absolute left-[-60px] top-20 h-40 w-40 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-cyan-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:items-center">
          {/* LEFT */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-700">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span>{eyebrow}</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {subtitle}
            </p>

            {badges.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm"
                  >
                    {b}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={primary.href}
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                {primary.text}
              </Link>

              <Link
                href={secondary.href}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {secondary.text}
              </Link>
            </div>

            <div className="mt-10 max-w-xl">
              <h3 className="text-base font-extrabold text-slate-900">
                {includesTitle}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {includesText}
              </p>

              {includesImages.length ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {includesImages.map((img, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-2xl border border-white bg-white shadow-md shadow-slate-200/60"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.imageUrl}
                        alt={img.alt || "Includes"}
                        className="h-16 w-20 object-cover sm:h-20 sm:w-24"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-full bg-sky-200/70 blur-2xl lg:block" />
            <div className="absolute -right-8 bottom-6 hidden h-36 w-36 rounded-full bg-cyan-200/60 blur-2xl lg:block" />

            <div className="relative overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] ring-1 ring-slate-200">
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 lg:aspect-[5/4]">
                {mediaType === "video" ? (
                  isHttpUrl(mediaUrl) ? (
                    <iframe
                      src={mediaUrl}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={title}
                    />
                  ) : (
                    <div className="grid h-full place-items-center px-6 text-center text-sm text-slate-500">
                      Falta mediaUrl (video embed).
                    </div>
                  )
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl || "https://picsum.photos/seed/hero/1200/900"}
                    alt={mediaAlt}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {mediaType === "video" ? "Video demo" : "Vista principal"}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  HeroMedia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}