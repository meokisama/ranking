// Small bridge between the preloader and the 3D scene: the scene reports "ready", the preloader reports "revealed".
type Listener = () => void;
const state = { ready: false, revealed: false };
const listeners = new Set<Listener>();

export const intro = {
  get ready() {
    return state.ready;
  },
  get revealed() {
    return state.revealed;
  },
  setReady() {
    state.ready = true;
    listeners.forEach((l) => l());
  },
  setRevealed() {
    state.revealed = true;
    listeners.forEach((l) => l());
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
};
