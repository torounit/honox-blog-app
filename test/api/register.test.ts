import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { createRegisterRoute } from '@/routes/api/register';
import { registerUser } from '@/lib/user-service';

// モックの設定
vi.mock('@/lib/user-service');
vi.mock('@/db');

const mockD1 = {} as D1Database;
const mockEnv = { DB: mockD1 };

describe('/api/register エンドポイント', () => {
  let app: Hono;

  beforeEach(() => {
    vi.clearAllMocks();
    
    app = new Hono();
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

    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    });

    const response = await app.request(req, mockEnv);
    expect(response.status).toBe(201);
    
    const data = await response.json();
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

    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User'
      })
    });

    const response = await app.request(req, mockEnv);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data).toEqual({
      success: false,
      error: '有効なメールアドレスを入力してください'
    });
  });

  it('既存のメールアドレスでエラーが返される', async () => {
    vi.mocked(registerUser).mockRejectedValue(new Error('このメールアドレスは既に登録されています'));

    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User'
      })
    });

    const response = await app.request(req, mockEnv);
    expect(response.status).toBe(409);
    
    const data = await response.json();
    expect(data).toEqual({
      success: false,
      error: 'このメールアドレスは既に登録されています'
    });
  });

  it('必須フィールドが不足している場合エラーが返される', async () => {
    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com'
        // password と name が不足
      })
    });

    const response = await app.request(req, mockEnv);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('必須');
  });
});