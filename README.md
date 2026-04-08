# Mind Drift

思考の断片を「つぶやき」として保存し、頭の中に浮かんでは消えるイメージで可視化する `Next.js` アプリです。  
認証は `Firebase Authentication` の Google ログイン、データ保存は `Cloud Firestore`、ホスティングは `Vercel` を想定しています。

## できること

- Google アカウントでログイン
- つぶやきを Firestore に保存
- 保存済みのつぶやきをリアルタイムに読み込み
- メイン画面で、つぶやきが脳内を漂うように表示
- 各ユーザーごとに 1 つの公開ページを発行
- 公開ページはログイン不要で閲覧のみ可能

## 技術構成

- `Next.js 15`
- `React 19`
- `Firebase Authentication`
- `Cloud Firestore`
- `Vercel`

## ローカルセットアップ

1. `.env.example` をもとに `.env.local` を作成します。
2. Firebase プロジェクトを作成し、Web アプリを追加します。
3. Firebase Authentication で `Google` プロバイダを有効化します。
4. Firestore Database を作成します。
5. 次のコマンドで依存関係をインストールします。

```bash
npm install
```

6. 開発サーバーを起動します。

```bash
npm run dev
```

## 必要な環境変数

`.env.local`

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Firestore の構成

### `users/{uid}`

ログインユーザー自身だけが読めるプロフィール情報を持ちます。

```ts
{
  uid: string
  displayName: string
  email: string
  photoURL: string | null
  shareId: string
  createdAtMs: number
  updatedAtMs: number
}
```

### `publicProfiles/{shareId}`

公開ページの URL に対応する公開プロフィールです。`shareId` がそのまま公開 URL に使われます。

```ts
{
  userId: string
  displayName: string
  photoURL: string | null
  shareId: string
  createdAtMs: number
  updatedAtMs: number
}
```

### `publicProfiles/{shareId}/whispers/{whisperId}`

公開ページとメイン画面の両方で使うつぶやき本体です。

```ts
{
  userId: string
  text: string
  createdAtMs: number
  updatedAtMs: number
}
```

## Firestore ルールの反映

このリポジトリには [`firestore.rules`](/home/sochi/works/ADHD/firestore.rules) を含めています。Firebase CLI を使う場合は、プロジェクトを選択したうえで以下を実行してください。

```bash
firebase deploy --only firestore:rules
```

## Vercel デプロイ

1. このプロジェクトを GitHub などに push
2. Vercel でリポジトリを Import
3. `.env.local` と同じ値を Vercel の Environment Variables に設定
4. デプロイ

`NEXT_PUBLIC_APP_URL` には本番 URL を設定してください。公開ページのリンク生成に使います。
