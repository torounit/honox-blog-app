import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser } from '@/lib/user-service';
import { createDb } from '@/db';

vi.mock('@/db');

describe('ユーザーログイン機能', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正しいメールアドレスとパスワードでログインできる', async () => {
    const mockDb = {
      query: {
        users: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'user-1',
            email: 'test@example.com',
            password: '$2a$12$hashed_password', // bcryptでハッシュ化されたパスワード
            name: 'Test User'
          })
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createDb).mockReturnValue(mockDb as any);
    const mockD1 = {} as D1Database;

    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const result = await loginUser(loginData, mockD1);

    expect(result).toEqual({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User'
    });
  });

  it('存在しないメールアドレスでのログインは失敗する', async () => {
    const mockDb = {
      query: {
        users: {
          findFirst: vi.fn().mockResolvedValue(null)
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createDb).mockReturnValue(mockDb as any);
    const mockD1 = {} as D1Database;

    const loginData = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };

    await expect(loginUser(loginData, mockD1)).rejects.toThrow('メールアドレスまたはパスワードが正しくありません');
  });

  it('間違ったパスワードでのログインは失敗する', async () => {
    const mockDb = {
      query: {
        users: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'user-1',
            email: 'test@example.com',
            password: '$2a$12$hashed_password',
            name: 'Test User'
          })
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createDb).mockReturnValue(mockDb as any);
    const mockD1 = {} as D1Database;

    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    await expect(loginUser(loginData, mockD1)).rejects.toThrow('メールアドレスまたはパスワードが正しくありません');
  });

  it('無効なメールアドレスでのログインは失敗する', async () => {
    const loginData = {
      email: 'invalid-email',
      password: 'password123'
    };

    await expect(loginUser(loginData)).rejects.toThrow('有効なメールアドレスを入力してください');
  });

  it('パスワードが空の場合のログインは失敗する', async () => {
    const loginData = {
      email: 'test@example.com',
      password: ''
    };

    await expect(loginUser(loginData)).rejects.toThrow('パスワードは必須です');
  });

  it('パスワードがnullユーザーのログインは失敗する', async () => {
    const mockDb = {
      query: {
        users: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'user-1',
            email: 'test@example.com',
            password: null, // OAuth ユーザーなどでパスワードがない場合
            name: 'Test User'
          })
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createDb).mockReturnValue(mockDb as any);
    const mockD1 = {} as D1Database;

    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    await expect(loginUser(loginData, mockD1)).rejects.toThrow('メールアドレスまたはパスワードが正しくありません');
  });
});