import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { registerUser } from '@/lib/user-service';

type Env = {
  DB: D1Database;
};

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

const registerValidation = validator('json', (value, c) => {
  try {
    if (!value || typeof value !== 'object') {
      return c.json({ 
        success: false, 
        error: 'リクエストデータが正しくありません' 
      }, 400);
    }

    const { email, password, name } = value as Record<string, unknown>;

    if (!email || !password || !name) {
      return c.json({ 
        success: false, 
        error: 'email、password、nameは必須です' 
      }, 400);
    }

    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
      return c.json({ 
        success: false, 
        error: 'email、password、nameは文字列である必要があります' 
      }, 400);
    }

    return {
      email: email.trim(),
      password,
      name: name.trim(),
    } as RegisterRequest;
  } catch {
    return c.json({ 
      success: false, 
      error: 'リクエストデータが正しくありません' 
    }, 400);
  }
});

export function createRegisterRoute() {
  const app = new Hono<{ Bindings: Env }>();

  app.post('/register', registerValidation, async (c) => {
    try {
      const data = c.req.valid('json');
      const db = c.env.DB;

      const result = await registerUser(data, db);

      return c.json({
        success: true,
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        }
      }, 201);

    } catch (error) {
      const message = error instanceof Error ? error.message : '登録に失敗しました';
      
      // エラーメッセージに基づいてステータスコードを決定
      let status = 500;
      if (message.includes('有効なメールアドレス') || 
          message.includes('パスワードは') || 
          message.includes('名前は必須')) {
        status = 400;
      } else if (message.includes('既に登録されています')) {
        status = 409;
      }

      return c.json({
        success: false,
        error: message
      }, status as 400 | 409 | 500);
    }
  });

  return app;
}

export default createRegisterRoute();