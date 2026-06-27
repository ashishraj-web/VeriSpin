// Minimal EIP-1193 provider type for the injected wallet (e.g. MetaMask).
// Avoids `any` while covering the surface this dApp actually uses.
interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  on: (eventName: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (eventName: string, handler: (...args: unknown[]) => void) => void;
}

interface Window {
  ethereum?: Eip1193Provider;
}
