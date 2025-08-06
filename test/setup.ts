import { vi } from 'vitest';

// Cloudflare Workers環境のモック
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).D1Database = vi.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).fetch = vi.fn();