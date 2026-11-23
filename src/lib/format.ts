export const nf = new Intl.NumberFormat("vi-VN");

export const pad = (n: number) => String(n).padStart(2, "0");

export const percent = (count: number, total: number) => ((count / total) * 100).toFixed(1).replace(".", ",") + "%";

/** A date (and with `time`, the hour) as read in Vietnam, whatever the reader's own zone. */
export const dateVN = (iso: string, time = false) =>
  new Date(iso).toLocaleString("vi-VN", {
    ...(time && { hour: "2-digit", minute: "2-digit" }),
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });

/** Lowercases and strips Vietnamese diacritics so searches match unaccented input. */
export const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
