/** localStorage that never throws: blocked or full storage just means nothing is remembered. */
export const store = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
