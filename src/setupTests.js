import '@testing-library/jest-dom';

/**
 * jsdom doesn't implement ResizeObserver, which React Flow requires.
 * Provide a minimal stub so components can mount without crashing.
 */
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
