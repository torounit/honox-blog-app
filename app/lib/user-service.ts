import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import { createDb } from '@/db';

interface RegisterUserData {
  email: string;
  password: string;
  name: string;
}

interface RegisterUserResult {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function registerUser(
  userData: RegisterUserData,
  d1?: D1Database
): Promise<RegisterUserResult> {
  const { email, password, name } = userData;

  if (!isValidEmail(email)) {
    throw new Error('有効なメールアドレスを入力してください');
  }

  if (password.length < 8) {
    throw new Error('パスワードは8文字以上である必要があります');
  }

  if (!name.trim()) {
    throw new Error('名前は必須です');
  }

  if (!d1) {
    throw new Error('データベース接続が必要です');
  }

  const db = createDb(d1);

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error('このメールアドレスは既に登録されています');
  }

  const hashedPassword = await hash(password, 12);

  const [newUser] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      name: name.trim(),
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name || '',
    createdAt: newUser.createdAt || new Date(),
    updatedAt: newUser.updatedAt || new Date(),
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}