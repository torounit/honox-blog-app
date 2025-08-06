import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser } from '@/lib/user-service';
import { createDb } from '@/db';

vi.mock('@/db');

describe('ユーザー登録機能', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('有効な情報でユーザーを登録できる', async () => {
    const mockDb = {
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{
            id: 'user-1',
            email: 'test@example.com',
            name: 'Test User',
            createdAt: new Date(),
            updatedAt: new Date()
          }])
        })
      }),
      query: {
        users: {
          findFirst: vi.fn().mockResolvedValue(null) // ユーザーが存在しない
        }
      }
    };

    vi.mocked(createDb).mockReturnValue(mockDb as any);

    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const result = await registerUser(userData);

    expect(result).toEqual({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });

  it('既存のメールアドレスでの登録は失敗する', async () => {
    const mockDb = {
      query: {
        users: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'existing-user',
            email: 'test@example.com'
          })
        }
      }
    };

    vi.mocked(createDb).mockReturnValue(mockDb as any);

    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    await expect(registerUser(userData)).rejects.toThrow('このメールアドレスは既に登録されています');
  });

  it('無効なメールアドレスでの登録は失敗する', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'password123',
      name: 'Test User'
    };

    await expect(registerUser(userData)).rejects.toThrow('有効なメールアドレスを入力してください');
  });

  it('短いパスワードでの登録は失敗する', async () => {
    const userData = {
      email: 'test@example.com',
      password: '123',
      name: 'Test User'
    };

    await expect(registerUser(userData)).rejects.toThrow('パスワードは8文字以上である必要があります');
  });

  it('名前が空の場合の登録は失敗する', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: ''
    };

    await expect(registerUser(userData)).rejects.toThrow('名前は必須です');
  });
});