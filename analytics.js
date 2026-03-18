if (typeof window !== 'undefined' && typeof window.ga !== 'function') {
  window.ga = () => {};
}

export function trackGa(...args) {
  if (typeof window !== 'undefined' && typeof window.ga === 'function') {
    window.ga(...args);
  }
}
