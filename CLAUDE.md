# CLAUDE.md

このファイルは Claude Code に対して、仕様や制約・目的を明示するためのガイドラインです。

---

## Claude Code の振る舞い
- 日本語でコミュニケーションを行ってください。
- **【重要】: t-wadaさんのTDD開発スタイルを行うこと。**

### コミットルール
- **【重要】: 1つのタスク完了したら必ずコミットして下さい。**
- **1機能1コミットで小さくコミットして下さい。**
- **コミットする際は、必ず、Typescript のエラー、ESLint のエラーを解消してからコミットして下さい。**
- Conventional Commits のルールに従ってコミットメッセージを記述してください。
- 🔴 テストを書いたら: `test: [機能] の失敗するテストを追加`
- 🟢 テストを通したら: `feat: テストを通すために [機能] を実装`
- 🔵 リファクタリングしたら: `refactor: [説明]`

---

## プロジェクト概要
[honox](https://github.com/honojs/honox/) を使用した Cloudflare Workers 上で動作するブログアプリケーションの開発。

## プロジェクトの目的
- Cloudflare Workers 上で動作するブログアプリケーションを開発する。
- [auth.js](https://github.com/nextauthjs/next-auth) を使用して email / パスワードでの認証を実装する。
- [honox](https://github.com/honojs/honox/)  を使用して、ブログ記事の CRUD 操作を実装する。

## 技術スタック
- git
- Cloudflare Workers
- Cloudflare D1
- Drizzle ORM
- honox
- auth.js
- wrangler
- TypeScript
- Tailwind CSS
- Shadcn UI
- playwright
- Vitest

## 仕様

### 認証
- auth.js を使用して、ユーザー認証を実装する。
- ユーザーは email とパスワードを使用してログインできる
- ユーザー登録機能を実施すする

### ブログ記事
- honox を使用して、ブログ記事の CRUD 操作を実装する。
- ブログ記事はタイトル、本文、作成日時、更新日時、著者、カテゴリ、タグを持つ。
- カテゴリーは、記事に一つ、タグは、複数持つことができる。
- ブログ記事は Markdown 形式で編集可能にする。表示時には HTML に変換する。
- ブログ記事は一覧表示、詳細表示、作成、編集、削除が可能。
- ブログ記事の一覧はページネーションをサポートする。
- ブログ記事の検索機能を実装する。

### URL構成

- `/` トップページ: ブログ記事の一覧を表示する。
- `/posts/[post_id]` 記事詳細ページ: ブログ記事の詳細を表示する。
- `/posts/search` 検索ページ: ブログ記事の検索を行う。
- `/posts/categories/[category]` カテゴリーページ: 特定のカテゴリーに属するブログ記事の一覧を表示する。
- `/posts/tags/[tag]` タグページ: 特定のタグに属するブログ記事の一覧を表示する。
- `/dashboard` ダッシュボード: ブログ記事の作成、編集、削除を行う。
- `/dashboard/posts` 記事一覧ページ: ユーザーが作成したブログ記事の一覧を表示する。
- `/dashboard/posts/new` 記事作成ページ: 新規ブログ記事の作成を行う。
- `/dashboard/posts/[post_id]` 記事編集ページ: ブログ記事の編集を行う。
- `/login` ログインページ: ユーザーがログインするためのページ。
- `/register` ユーザー登録ページ: 新規ユーザーが登録するためのページ。

### データベース
- Cloudflare D1 を使用して、ブログ記事やユーザー情報を管理する。
- Drizzle ORM を使用して、データベース操作を行う。
- ID は UUID を使用する。
- Drizzle Seed を使用して、初期データを投入する。

---

## 開発環境
- `wrangler dev` を使用して、Cloudflare Workers のローカル開発環境を構築する。
- Vitest を使用して、ユニットテストを実行する。
- Playwright を使用して、E2E テストを実行する。

---

## プロジェクトのはじめ方
1. `https://github.com/honojs/honox/blob/main/README.md` を参照して honox プロジェクトを作成して下さい。`echo 'y' | npm create hono@latest -- . --template x-basic -p npm -i` を実行してプロジェクトを作成出来ます。
2. TypeScript を installして、`tsconfig.json` を生成して下さい。
3. Eslint を用いた lint の設定も行ってください。
4. `npx shadcn@latest init` を実行して Shadcn UI を初期化して下さい。`npx shadcn add [コンポーネント名]` を実行してコンポーネントを追加できます。

