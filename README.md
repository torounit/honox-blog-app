# honox-blog-app

Cloudflare Workers 上で動作する [Honox](https://honox.dev/) ベースのモダンなブログアプリケーションです。

## 特徴

- 🚀 **高速なパフォーマンス**: Cloudflare Workers エッジランタイムによる高速レスポンス
- 🔐 **認証機能**: auth.js による email/パスワード認証とユーザー登録
- 📝 **Markdown サポート**: Markdown 形式での記事作成・編集
- 🎨 **モダンな UI**: Tailwind CSS + Shadcn UI による美しいインターフェース
- 📊 **フルスタック対応**: Honox による型安全なフルスタック開発
- 🗄️ **データベース**: Cloudflare D1 + Drizzle ORM による型安全なデータ操作
- 🔍 **検索機能**: ブログ記事の全文検索
- 🏷️ **カテゴリ・タグ**: 記事の分類と整理
- 📱 **レスポンシブデザイン**: モバイルフレンドリーな設計
- ⚡ **ホットリロード**: Vite による高速な開発体験

## 技術スタック

- **Framework**: [Honox](https://honox.dev/) - Hono ベースのフルスタックフレームワーク
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [auth.js](https://authjs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Build**: [Vite](https://vitejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## セットアップ

### 前提条件

- Node.js 18以上
- npm
- Cloudflare アカウント（デプロイ時）

### 1. リポジトリをクローン

```bash
git clone https://github.com/torounit/honox-blog-app.git
cd honox-blog-app
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. データベースのセットアップ

```bash
# データベーススキーマの生成
npm run db:generate

# マイグレーションの実行
npm run db:migrate
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてアプリケーションを確認できます。

### 5. 開発用データベースの確認

```bash
# Drizzle Studio でデータベースを確認
npm run db:studio
```

## 利用可能なスクリプト

```bash
# 開発サーバーの起動
npm run dev

# 本番用ビルド
npm run build

# Cloudflare Workers でのプレビュー
npm run preview

# Cloudflare Workers へのデプロイ
npm run deploy

# Lint チェック
npm run lint

# Lint の自動修正
npm run lint:fix

# TypeScript の型チェック
npm run typecheck

# ユニットテストの実行
npm run test

# ユニットテストの実行（UI付き）
npm run test:ui

# ユニットテストの単発実行
npm run test:run

# E2E テストの実行
npm run e2e

# E2E テストの実行（UI付き）
npm run e2e:ui
```

## デプロイ

### Cloudflare Workers へのデプロイ

1. [Cloudflare Workers](https://workers.cloudflare.com/) アカウントを作成

2. Wrangler CLI でログイン
```bash
npx wrangler login
```

3. D1 データベースの作成
```bash
npx wrangler d1 create blog-db
```

4. `wrangler.jsonc` の `database_id` を更新

5. 本番データベースへのマイグレーション
```bash
npx wrangler d1 migrations apply blog-db
```

6. デプロイ実行
```bash
npm run deploy
```

### その他のプラットフォーム

このアプリケーションは Cloudflare Workers に最適化されていますが、Hono の互換性により他のプラットフォームでも動作可能です：

- **Vercel**: [Hono Vercel アダプター](https://hono.dev/getting-started/vercel)
- **Netlify**: [Hono Netlify アダプター](https://hono.dev/getting-started/netlify)
- **Bun**: 直接実行可能
- **Node.js**: [Hono Node.js アダプター](https://hono.dev/getting-started/nodejs)

## 機能

### ブログ機能
- ✅ 記事の作成・編集・削除（CRUD）
- ✅ Markdown での記事作成
- ✅ カテゴリとタグによる分類
- ✅ 記事の一覧表示（ページネーション）
- ✅ 記事の検索機能
- ✅ 記事の詳細表示

### 認証機能
- ✅ ユーザー登録
- ✅ Email/パスワードでのログイン
- ✅ ダッシュボードへのアクセス制御

### URL構成
- `/` - トップページ（記事一覧）
- `/posts/[post_id]` - 記事詳細ページ
- `/posts/search` - 検索ページ
- `/posts/categories/[category]` - カテゴリ別記事一覧
- `/posts/tags/[tag]` - タグ別記事一覧
- `/dashboard` - ダッシュボード
- `/dashboard/posts` - 記事管理一覧
- `/dashboard/posts/new` - 記事作成
- `/dashboard/posts/[post_id]` - 記事編集
- `/login` - ログイン
- `/register` - ユーザー登録

## 開発

### テスト

```bash
# ユニットテストの実行
npm run test

# E2E テストの実行
npm run e2e
```

### コードスタイル

このプロジェクトでは以下のツールを使用してコード品質を保っています：

- **ESLint**: JavaScript/TypeScript の静的解析
- **TypeScript**: 型安全性の確保
- **Prettier**: コードフォーマット（ESLint 統合）

### データベース

```bash
# スキーマ変更後の生成
npm run db:generate

# マイグレーションの適用
npm run db:migrate

# データベースの確認
npm run db:studio
```

## 貢献

プロジェクトへの貢献を歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

MIT License

## 関連リンク

- [Honox Documentation](https://honox.dev/)
- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Drizzle ORM](https://orm.drizzle.team/)