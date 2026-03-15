# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
# Node.js が PATH に含まれていない場合は先に実行
export PATH="/opt/homebrew/bin:$PATH"

npm run dev      # 開発サーバー起動 (http://localhost:5173)
npm run build    # 型チェック (tsc -b) + プロダクションビルド → dist/
npm run lint     # ESLint 実行
npm run preview  # dist/ をローカルプレビュー
```

## Architecture

状態管理はすべて `App.tsx` で行い、`localStorage` に `todos-v1` キーで永続化している。コンポーネントは props 経由でコールバックを受け取るだけで、自身では状態を持たない。

### データフロー

```
App.tsx (useState + localStorage)
  ├── Header         → onToggleForm
  ├── AddTodoForm    → onAdd(data)   ※ showForm=true のときのみ AnimatePresence でレンダリング
  ├── Stats          → total / completed (表示のみ)
  ├── FilterBar      → filter / setFilter / onClearCompleted
  └── TodoList
        └── TodoItem → onToggle(id) / onDelete(id)
```

### 型定義 (`src/types.ts`)

- `Todo` — アプリ全体で使うコアデータ型。`dueDate` は `YYYY-MM-DD` 文字列（任意）。
- `Priority` — `'high' | 'medium' | 'low'`
- `Category` — `'work' | 'personal' | 'shopping' | 'health' | 'other'`
- `Filter` — `'all' | 'active' | 'completed'`

### スタイリング

CSS カスタムプロパティはすべて `src/styles.css` の `:root` ブロックに集約。Tailwind は使用していない。コンポーネント固有のスタイルも同ファイルに記述する（CSS Modules 不使用）。

### アニメーション

framer-motion を使用。リスト項目の追加・削除は `AnimatePresence` + `layout` prop、フォームの展開/折りたたみは `height: 0 → 'auto'` のアニメーションで実装。

## TypeScript 設定の注意点

`verbatimModuleSyntax: true` が有効なため、型のみのインポートは `import type { Foo }` と明示する必要がある。

## デプロイ

- GitHub リポジトリ: `tomo2001159/claude-todo`
- Vercel にて `main` ブランチへのプッシュで自動デプロイ
- 本番 URL: https://claude-todo-seven.vercel.app/
