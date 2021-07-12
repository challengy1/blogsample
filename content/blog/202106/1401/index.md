---
title: Gatsby Breakpoints
date: "2021-06-14"
update: "2021-06-14"
description: "Web 開発にはレスポンシブが必須です。Gatsbyで開発する時にレスポンシブ対応を後押ししてくれる便利なプラグインがありますのでご紹介します。"
tags: [Gatsby]
table: true
hero: ./Responsive.png
---
デバイスの多様化でレスポンシブが必須の時代です。レスポンシブデザインの優れた作品を公開しているサイトまであります。

[RESPONSIVE WEB DESIGN JP](https://responsive-jp.com)

中々気合の入った作品が紹介されており、凄いと思う一方で大変だろうなと感じてしまいます。

レスポンシブと言えばメディアクエリ、メディアクエリと言うと @media screen and (min-width: 900px)... とか例の奴です。これは完全に CSS の世界です。

（例えば React/Gatsby なんかで）開発していると React/JSX レベルで画面幅に応じて処理を変えたい場合があります。
画面がある幅よりも狭い時はサイドバーを消したいとか、その際は nav 部分のメニューにその部分を移したいとか。簡単な条件であれば CSS だけで何とかした方が簡単です。
しかし複雑な条件の場合 JSX のレベルで何とかしたい場合があります。そんな時に使える道具を紹介します。

環境

| Package | Version |
|---------|---------|
| node|14.15.3|
| npm|7.17.0|
| gatsby|3.6.1|
| react|17.0.2|

# プラグイン

Gatsby はプラグインの宝庫で、その中に gatsby-plugin-breakpoints というのがあります。
react では react-breakpoints というのが有りますが、プラグインは直接これを使っている訳ではなさそうです。
詳細は本家の情報をご覧いただくとして概略抜粋します。
もちろん変更できますが、ディフォルトではブレークポイントは次の通りです。

| 名前 | プレークポイント |
|:---:| ---:|
|xs | max-width: 320px |
|sm | max-width: 720px |
|md | max-width:1024px |
|l  | max-width:1536px |

用途によりますが、皆さんはどの様な設定をされているでしょうか？上のディフォルトは少し細かすぎるかも知れません。

# インストール

```bash
npm install gatsby-plugin-breakpoints
```

なお、TypeScript を使う場合は @types もインストールします。

```bash
npm install -D @types/gatsby-plugin-breakpoints
```

バージョンは下記の通りでした。

| package | Version |
|---------|---------|
|gatsby-plugin-breakpoints|1.3.3|
|types/gatsby-plugin-breakpoints|1.3.0|

# 設定

例によって gatsby-config.js に記述します。プラグインの記述順は特に制約は無い様です。

```javascript --title=gatsby-config.js --line --number=1-4,10-15
const breakPoints = {
  md: '(min-width: 520px)',
  pc: '(min-width: 960px)',
};
// ... 略
module.exports = {
  // ... 略
  plugins: [
    // ... 略
    {
      resolve: 'gatsby-plugin-breakpoints',
      options: {
        queries: breakPoints,
      },
    },
  ],
};
```

1~4 行目で breakPoints を定義しています。この場合 520px と 960px にしています。

10~15 行目で gatsby-plugin-breakpoints を指定しています。その際上記の breakPoints を引用しています。

# 使い方

```typescript --line --number=2,6,8-14
import { PageProps } from 'gatsby';
import { useBreakpoint } from 'gatsby-plugin-breakpoints';

const Index:FC<PageProps<dataType>> = ({ data }) => {
  // ... 略
  const breakpoints = useBreakpoint();
  // ... 略
  {breakpoints.pc ? (
        <div className={sidebar}>
          <Sidebar />
        </div>
    ) : (
        <div />
    )}
```

2 行目で useBreakpoint を import しています。

6 行目で useBreakpoint を使って breakpoints を取得。

8 ~ 14 行目では pc のサイズ（この場合 960px）より大きい場合、Sidebar を表示、それより小さい場合は表示しません。

当然ながらCSSと組み合わせる必要が随所に発生するでしょう。その場合 styled-component を使うとかの手が使えるでしょう。
私の場合は Emotion を使って動的に css を変更できるので、その方法を採用しています。

-----

このブログは Gatsby で作っています。
技術系ブログの場合小さいスマホで見ることはあまり無いとは思いますが、それでも少しは配慮したいと思います。
gatsby-plugin-breakpoints が用途に上手く合ってくれているようですが、まだまだ活用の余地がありそうです。
技術系ブログではなくコンシューマ用途の場合はもっと活躍してくれる事と思います。
画面を狭くして頂けば右のサイドバーが消え、右上にハンバーガーメニューが現れるのがご覧頂けます。
この機能の実現にこのプラグインを使っています。

このプラグインは内部的には JavaScript の matchMedia() を使っている様です。

```javascript
if (window.matchMedia( "(min-width: 400px)" ).matches) {
  /* ビューポートの幅が 400 ピクセル以上の場合のコードをここに書く */
} else {
  /* ビューポートの幅は 400 ピクセル未満の場合のコードをここに書く */
}
```

これからもブログの開発を通じて知ったことを追々紹介したいと思います。
