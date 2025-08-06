import { AuthConfig } from '@auth/core';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { DB } from '@/db';
import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';

export function createAuthConfig(db: DB): AuthConfig {
  return {
    adapter: DrizzleAdapter(db),
    providers: [
      {
        id: 'credentials',
        name: 'credentials',
        type: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email as string),
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        },
      }
    ],
    session: {
      strategy: 'jwt',
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        if (token?.id) {
          session.user.id = token.id as string;
        }
        return session;
      },
    },
    pages: {
      signIn: '/login',
    },
  };
}