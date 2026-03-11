import HeaderClient, { type HeaderData } from "./HeaderClient";

async function getHeaderData(): Promise<HeaderData> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/layout/header`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return (await res.json()) as HeaderData;
  } catch {
    return {
      logoUrl: null,
      links: [],
      cta: null,
    };
  }
}

export default async function Header() {
  const data = await getHeaderData();
  return <HeaderClient data={data} />;
}