import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { createLoginRoute } from '@/routes/api/login';
import { loginUser } from '@/lib/user-service';

// モックの設定
vi.mock('@/lib/user-service');
vi.mock('@/db');

interface MockEnv {
  DB: D1Database;
}

interface LoginApiResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

const mockD1 = {} as D1Database;
const mockEnv: MockEnv = { DB: mockD1 };

describe('/api/login エンドポイント', () => {
  let app: Hono<{ Bindings: MockEnv }>;

  beforeEach(() => {
    vi.clearAllMocks();

    app = new Hono<{ Bindings: MockEnv }>();
    app.route('/api', createLoginRoute());
  });

  it('正しいメールアドレスとパスワードでログインが成功する', async () => {
    vi.mocked(loginUser).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User'
    });

    const response = await app.request('/api/login', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    }, mockEnv);
    expect(response.status).toBe(200);

    const data = await response.json() as LoginApiResponse;
    expect(data).toEqual({
      success: true,
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User'
      }
    });
  });

  it('存在しないメールアドレスでエラーが返される', async () => {
    vi.mocked(loginUser).mockRejectedValue(new Error('メールアドレスまたはパスワードが正しくありません'));

    const response = await app.request('/api/login', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'password123'
      })
    }, mockEnv);
    expect(response.status).toBe(401);

    const data = await response.json() as LoginApiResponse;
    expect(data).toEqual({
      success: false,
      error: 'メールアドレスまたはパスワードが正しくありません'
    });
  });

  it('間違ったパスワードでエラーが返される', async () => {
    vi.mocked(loginUser).mockRejectedValue(new Error('メールアドレスまたはパスワードが正しくありません'));

    const response = await app.request('/api/login', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    }, mockEnv);
    expect(response.status).toBe(401);

    const data = await response.json() as LoginApiResponse;
    expect(data).toEqual({
      success: false,
      error: 'メールアドレスまたはパスワードが正しくありません'
    });
  });

  it('無効なメールアドレスでエラーが返される', async () => {
    vi.mocked(loginUser).mockRejectedValue(new Error('有効なメールアドレスを入力してください'));

    const response = await app.request('/api/login', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'password123'
      })
    }, mockEnv);
    expect(response.status).toBe(400);

    const data = await response.json() as LoginApiResponse;
    expect(data).toEqual({
      success: false,
      error: '有効なメールアドレスを入力してください'
    });
  });

  it('パスワードが空の場合エラーが返される', async () => {
    const response = await app.request('/api/login', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'test@example.com',
        password: ''
      })
    }, mockEnv);
    expect(response.status).toBe(400);

    const data = await response.json() as LoginApiResponse;
    expect(data).toEqual({
      success: false,
      error: 'email、passwordは必須です'
    });
  });

  it('必須フィールドが不足している場合エラーが返される', async () => {
    const response = await app.request('/api/login', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'test@example.com'
        // password が不足
      })
    }, mockEnv);
    expect(response.status).toBe(400);

    const data = await response.json() as LoginApiResponse;
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
    expect(data.error!).toContain('必須');
  });

  it('データベース接続エラーの場合500エラーが返される', async () => {
    vi.mocked(loginUser).mockRejectedValue(new Error('データベース接続が失敗しました'));

    const response = await app.request('/api/login', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    }, mockEnv);
    expect(response.status).toBe(500);

    const data = await response.json() as LoginApiResponse;
    expect(data).toEqual({
      success: false,
      error: 'データベース接続が失敗しました'
    });
  });
});