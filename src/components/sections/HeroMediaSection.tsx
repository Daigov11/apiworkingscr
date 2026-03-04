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

  const primary = d.primaryCta?.text ? d.primaryCta : { text: "Solicitar demo", href: "/contacto" };
  const secondary = d.secondaryCta?.text ? d.secondaryCta : { text: "Ver productos", href: "/productos" };

  const mediaType = d.mediaType === "video" ? "video" : "image";
  const mediaUrl = d.mediaUrl || "";
  const mediaAlt = d.mediaAlt || title;

  const includesTitle = d.includesTitle || "Tu sistema incluye:";
  const includesText = d.includesText || "Pagos QR, facturación y módulos listos para operar.";
  const includesImages = Array.isArray(d.includesImages) ? d.includesImages.slice(0, 6) : [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-white">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950/30 p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-black/20 px-3 py-1 text-xs font-bold text-neutral-200">
              <span className="text-sm">✦</span>
              <span className="uppercase tracking-wide">{eyebrow}</span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-xl text-base text-neutral-200 md:text-lg">
              {subtitle}
            </p>

            {badges.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-neutral-800 bg-black/20 px-3 py-1 text-xs text-neutral-200"
                  >
                    {b}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={primary.href}
                className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-black"
              >
                {primary.text}
              </Link>

              <Link
                href={secondary.href}
                className="rounded-xl border border-neutral-800 bg-black/10 px-5 py-3 text-sm font-extrabold text-white hover:bg-neutral-900/40"
              >
                {secondary.text}
              </Link>
            </div>

            {/* Includes */}
            <div className="mt-8 rounded-2xl border border-neutral-800 bg-black/20 p-4">
              <div className="text-lg font-extrabold">{includesTitle}</div>
              <div className="mt-2 text-sm text-neutral-200">{includesText}</div>

              {includesImages.length ? (
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {includesImages.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img.imageUrl}
                      alt={img.alt || "Includes"}
                      className="h-16 w-full rounded-xl object-cover border border-neutral-800"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* RIGHT (Media) */}
          <div className="rounded-3xl border border-neutral-800 bg-black/20 p-3">
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
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
                  <div className="grid h-full place-items-center text-sm text-neutral-300">
                    Falta mediaUrl (video embed).
                  </div>
                )
              ) : (
                // image
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl || "https://picsum.photos/seed/hero/1200/800"}
                  alt={mediaAlt}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
              <span>{mediaType === "video" ? "Video demo" : "Imagen"}</span>
              <span className="rounded-full border border-neutral-800 bg-black/10 px-2 py-1">
                HeroMedia
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}