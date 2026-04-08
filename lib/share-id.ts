function slugifyDisplayName(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized.slice(0, 24) || "mind";
}

export function createShareId(seed: string | null | undefined) {
  const base = slugifyDisplayName(seed ?? "");
  const random = Math.random().toString(36).slice(2, 8);
  return `${base}-${random}`;
}
