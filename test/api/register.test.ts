import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { testClient } from 'hono/testing';
import { createRegisterRoute } from '@/routes/api/register';

// モックの設定
vi.mock('@/lib/user-service');
vi.mock('@/db');

const mockD1 = {} as D1Database;
const mockEnv = { DB: mockD1 };

describe('/api/register エンドポイント', () => {
  let app: Hono;
  let client: ReturnType<typeof testClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    app = new Hono();
    app.route('/api', createRegisterRoute());
    client = testClient(app, mockEnv);
  });

  it('正しいデータでユーザー登録が成功する', async () => {
    // user-serviceのmock
    const { registerUser } = await vi.importActual('@/lib/user-service') as any;
    vi.mocked(registerUser).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    });

    const response = await client.api.register.$post({
      json: {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }
    });

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
    const { registerUser } = await vi.importActual('@/lib/user-service') as any;
    vi.mocked(registerUser).mockRejectedValue(new Error('有効なメールアドレスを入力してください'));

    const response = await client.api.register.$post({
      json: {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User'
      }
    });

    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data).toEqual({
      success: false,
      error: '有効なメールアドレスを入力してください'
    });
  });

  it('既存のメールアドレスでエラーが返される', async () => {
    const { registerUser } = await vi.importActual('@/lib/user-service') as any;
    vi.mocked(registerUser).mockRejectedValue(new Error('このメールアドレスは既に登録されています'));

    const response = await client.api.register.$post({
      json: {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User'
      }
    });

    expect(response.status).toBe(409);
    
    const data = await response.json();
    expect(data).toEqual({
      success: false,
      error: 'このメールアドレスは既に登録されています'
    });
  });

  it('短いパスワードでエラーが返される', async () => {
    const { registerUser } = await vi.importActual('@/lib/user-service') as any;
    vi.mocked(registerUser).mockRejectedValue(new Error('パスワードは8文字以上である必要があります'));

    const response = await client.api.register.$post({
      json: {
        email: 'test@example.com',
        password: '123',
        name: 'Test User'
      }
    });

    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data).toEqual({
      success: false,
      error: 'パスワードは8文字以上である必要があります'
    });
  });

  it('必須フィールドが不足している場合エラーが返される', async () => {
    const response = await client.api.register.$post({
      json: {
        email: 'test@example.com',
        // password と name が不足
      } as any
    });

    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('必須');
  });

  it('JSONでないデータが送信された場合エラーが返される', async () => {
    const response = await fetch(client.api.register.$url(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'invalid data'
    });

    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data).toEqual({
      success: false,
      error: 'リクエストデータが正しくありません'
    });
  });
});