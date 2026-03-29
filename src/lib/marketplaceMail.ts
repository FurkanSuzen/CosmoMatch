import type { ProductListing } from "../types/marketplace";

export function contactEmailForListing(item: ProductListing): string | null {
  const e = item.contactEmail?.trim() ?? "";
  return e || null;
}

export function mailtoContactListingSeller(item: ProductListing): string | null {
  const to = contactEmailForListing(item);
  if (!to) return null;
  const subject = `${item.companyName} – "${item.title}" pazar ilanı`;
  const body = [
    "Merhaba,",
    "",
    `CosmoMatch pazar alanındaki "${item.title}" ilanınız (${item.companyName}) ile ilgileniyorum.`,
    "Teknik detaylar ve iş birliği / satın alma süreci hakkında bilgi almak isterim.",
    "",
    "Saygılarımla,",
  ].join("\n");
  const params = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `mailto:${to}?${params}`;
}

export function openListingContactMail(item: ProductListing): boolean {
  const href = mailtoContactListingSeller(item);
  if (!href) return false;
  window.location.href = href;
  return true;
}
