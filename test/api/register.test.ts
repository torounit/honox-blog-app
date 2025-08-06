import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { createRegisterRoute } from '@/routes/api/register';
import { registerUser } from '@/lib/user-service';

// モックの設定
vi.mock('@/lib/user-service');
vi.mock('@/db');

interface MockEnv {
  DB: D1Database;
}

interface ApiResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

const mockD1 = {} as D1Database;
const mockEnv: MockEnv = { DB: mockD1 };

describe('/api/register エンドポイント', () => {
  let app: Hono<{ Bindings: MockEnv }>;

  beforeEach(() => {
    vi.clearAllMocks();

    app = new Hono<{ Bindings: MockEnv }>();
    app.route('/api', createRegisterRoute());
  });

  it('正しいデータでユーザー登録が成功する', async () => {
    vi.mocked(registerUser).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    });

    const response = await app.request('/api/register', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    }, mockEnv);
    expect(response.status).toBe(201);

    const data = await response.json() as ApiResponse;
    expect(data).toEqual({
      success: true,
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    });
  });

  it('無効なメールアドレスでエラーが返される', async () => {
    vi.mocked(registerUser).mockRejectedValue(new Error('有効なメールアドレスを入力してください'));

    const response = await app.request('/api/register', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User'
      })
    }, mockEnv);
    expect(response.status).toBe(400);

    const data = await response.json() as ApiResponse;
    expect(data).toEqual({
      success: false,
      error: '有効なメールアドレスを入力してください'
    });
  });

  it('既存のメールアドレスでエラーが返される', async () => {
    vi.mocked(registerUser).mockRejectedValue(new Error('このメールアドレスは既に登録されています'));

    const response = await app.request('/api/register', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User'
      })
    }, mockEnv);
    expect(response.status).toBe(409);

    const data = await response.json() as ApiResponse;
    expect(data).toEqual({
      success: false,
      error: 'このメールアドレスは既に登録されています'
    });
  });

  it('必須フィールドが不足している場合エラーが返される', async () => {
    const response = await app.request('/api/register', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'test@example.com'
        // password と name が不足
      })
    }, mockEnv);
    expect(response.status).toBe(400);

    const data = await response.json() as ApiResponse;
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
    expect(data.error!).toContain('必須');
  });
});
