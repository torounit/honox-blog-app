import { vi } from 'vitest';

// Cloudflare Workers環境のモック
global.D1Database = vi.fn() as any;
global.fetch = vi.fn() as any;