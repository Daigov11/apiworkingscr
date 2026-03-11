export function getCurrentBd() {
  const bd =
    typeof window === "undefined"
      ? process.env.CMS_DEFAULT_BD
      : process.env.NEXT_PUBLIC_CMS_DEFAULT_BD;

  if (!bd) {
    throw new Error("Falta CMS_DEFAULT_BD o NEXT_PUBLIC_CMS_DEFAULT_BD");
  }

  return bd;
}

export function withBd(url: string) {
  const target = new URL(url);

  if (!target.searchParams.has("bd")) {
    target.searchParams.set("bd", getCurrentBd());
  }

  return target.toString();
}