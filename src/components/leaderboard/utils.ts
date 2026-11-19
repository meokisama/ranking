import type { Entry } from "@/lib/data";

/** Secondary line of an entry: its publisher, or the works an illustrator is known for. */
export const subOf = (e: Entry) => e.publisher ?? e.works?.join(" · ") ?? "";
