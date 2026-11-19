export const nf = new Intl.NumberFormat("vi-VN");

export const pad = (n: number) => String(n).padStart(2, "0");

export const percent = (count: number, total: number) => ((count / total) * 100).toFixed(1).replace(".", ",") + "%";

/** Lowercases and strips Vietnamese diacritics so searches match unaccented input. */
export const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
