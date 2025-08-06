import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { loginUser } from '@/lib/user-service';

type Env = {
  DB: D1Database;
};

interface LoginRequest {
  email: string;
  password: string;
}

const loginValidation = validator('json', (value, c) => {
  try {
    if (!value || typeof value !== 'object') {
      return c.json({ 
        success: false, 
        error: 'リクエストデータが正しくありません' 
      }, 400);
    }

    const { email, password } = value as Record<string, unknown>;

    if (!email || !password) {
      return c.json({ 
        success: false, 
        error: 'email、passwordは必須です' 
      }, 400);
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return c.json({ 
        success: false, 
        error: 'email、passwordは文字列である必要があります' 
      }, 400);
    }

    return {
      email: email.trim(),
      password,
    } as LoginRequest;
  } catch {
    return c.json({ 
      success: false, 
      error: 'リクエストデータが正しくありません' 
    }, 400);
  }
});

export function createLoginRoute() {
  const app = new Hono<{ Bindings: Env }>();

  app.post('/login', loginValidation, async (c) => {
    try {
      const data = c.req.valid('json');
      const db = c.env.DB;

      const result = await loginUser(data, db);

      return c.json({
        success: true,
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
        }
      }, 200);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'ログインに失敗しました';
      
      // エラーメッセージに基づいてステータスコードを決定
      let status = 500;
      if (message.includes('有効なメールアドレス') || 
          message.includes('パスワードは必須')) {
        status = 400;
      } else if (message.includes('メールアドレスまたはパスワードが正しくありません')) {
        status = 401;
      }

      return c.json({
        success: false,
        error: message
      }, status as 400 | 401 | 500);
    }
  });

  return app;
}

export default createLoginRoute();