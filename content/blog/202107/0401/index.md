---
title: mdx をはがす
date: "2021-07-05"
update: "2021-07-05"
description: "結局 mdx を剥がす事にしました。その計画の中で一番の立役者は rehype-react です。
今回は rehype 関連の仕掛けを紹介します。rehype は色々と使い道が多いと思われますので、参考になれば幸いです。"
tags: [Gatsby, React, MDX, Markdown, Rehype]
table: true
hero: ./markdownlogo.jpg
---
# mdxを剥がす

mdx（gatsby-plugin-mdx）の謳い文句は Markdown に JSX が書けると言うものです。
あまり調査せず、md より mdx の方が高機能であると言うだけの理由で mdx で作り始めましたが、前回レポートした通り不具合が見つかりました。
調べてみると mdx を md にするには gatsby-plugin-mdx を gatsby-transformer-remark にする必要があり、作りが変わってしまいます。
一番影響が大きかったのは Syntax Highlighter などに使っている仕掛である MDXProvider が使えなくなる事でした。
MDXProvider は出力された HTML に手を加える仕掛けとして使っていました。

<br />

Markdown 上でバッククオート３個で挟まれた部分は HTML では次の形に変換されます。
```plain
<pre>
  <code>
  // ここにコードブロックが入ります。
  </code>
</pre>
```

<br />

ここで必要な機能は `<pre><code>` と `</code></pre>` で囲まれたコードブロックを書き換えてやる事です。
この機能を実現しているのは mdx では次のコードです（でした）。

```typescript --title=blog-post.tsx --height=220px
// 略
const components = {
  pre: CodeBlock,
};
// 略
    <MDXProvider components={components}>
        <MDXRenderer>{post.body}</MDXRenderer>
    </MDXProvider>
// 略
```

そして別に用意する CodeBlock と言うコンポーネントに `<pre>` タグの子要素を渡して処理させていました。
これはよく紹介されている方法です。

# rehype

Gatsby では __remark__ と言う言葉は度々登場しますが、__rehype__ というのは中々お目に掛かりません。

色々調べてみると、MDXProvider の機能は __rehype-react__ で代替えできそうだと言うことが分かりました。
加えて将来機能追加の可能性もあり、早速、調査 & テストに掛かりました。

<br />

HTML に変換された後の段階で手を加えるので、rehype の機能を使います。
rehype のパーサ機能である rehype-parse で処理するべき HTML を抽象構文木（hast）に変換します。
そして hast を rehype-react を使って React コンポーネントにしてやります。
この途中で rehype-react の機能を使って HTML に手を入れます。
なお、GraphQL からは html のみではなく htmlAst （抽象構文木）と言う形式でも出力できますが、
htmlAst は使わないで html をパースする事にしました。
理由は後述の processor を組み立てる方法として Parser の過程が必要だったからです。
（この点は何か解決する方法があるかも知れません。解決できれば折角抽象構文木になっている htmlAst がそのまま使えます。）

<br />

都合がよかったのは mdx ベースの時作った CodeBlock がほとんどそのまま使えると言うことでした。
ラッキ〜！

<br />

基本構造は次の通りです。

```tsx --line --number=10,14
import unified from 'unified';
import rehypeReact from 'rehype-react';
import rehypeParse from 'rehype-parse';
// ... 略
  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeReact, {
      createElement: React.createElement,
      components: {
        pre: (props: rehypeReact.ComponentProps) => <CodeBlock {...props} />,
　　　　},
　　});
// ... 略
  <div css={article}>{processor.processSync(html).contents}</div>
```

1 ~ 3 行目で必要なパッケージをインポートしています。

5 ~ 12 行目で processor を組み立ています。
その中で 10 行目、 pre タグと CodeBlock コンポーネントの対応づけをしています。
今回は HTML 標準の pre タグと変換用のコンポーネントの対応を指定しましたが、 ここに HTML 標準ではない新しいタグとコンポーネントを指定すれば、
新規機能を追加することもできます。

つまり、mdx を使わなくても独自の React コンポーネントを Markdown から使う事ができます。
（ただし、あまりこれをやり過ぎると段々 Markdown ではなくなってきます。）

<br />

今回は rehype-react の機能だけを使ったので、rehypeParse の直後に rehypeReact が記述してありますが、
rehype プラグインを使うのであれば、その間に .use(...) を挟んでやれば構文木の中を好きに操作できます。
すでに多くのプラグインが用意されていますので下記サイトをご覧ください。

<br />

[rehype Plugin](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)

<br />

既存のプラグインではなく独自プラグインを作る手引きも用意されています。このプラグインによる機能追加は魅力的です。
将来もし必要になったらここに機能を追加できます。

実際 processor を動かしているのは 14 行目です。
processSync は定義した processor を同期的に起動する関数で、引数は processor への入力です。
この場合 html が引数に入り、これがパースの対象になります。processor は非同期で起動することも可能で、その場合は Promise を扱ってやります。

# CodeBlock

バッククオート３個で囲まれた部分は HTML では次の形で渡されます。

```markup
<code props>
  ... ここに目的のコードが入っています。
</code>
```

まず解決しないといけないのは children を含む props の中身を取り出すことです。実はこの部分で嵌りました。
mdx ベースで実現していた場合と渡される props の構造が違っていたのが原因でした。

mdx / MDXProvider ベースの場合
```typescript
type propType = {
  props: {
    children: {
      props: {
        className: string
        children: string
      }
    }
  }
}
```

実際の中身は次のように取り出しました。

```typescript
const code = porps.children.props.children;
```

rehype-react の場合は下記の構造であることが分かりました。
```typescript
type propType = {
  props: {
    children: [
      props: {
        className: string
        data-meta: string
        children: string[]
      }
    ]
  }
}
```

ひとりっ子ではなく、兄弟がいるような記述に変わっています。取り出しは次のように変更する必要があります。

```typescript
const code = porps.children[0].props.children[0];
```

硬い事を言うと、本当に配列の最初の要素だけで良いか？と言う疑問があります。
しかし調べてみると、現実的には配列要素数は一つだけでした。
children が配列になっていた事に気づかずハマりました。調べてやっと上記の構造が分かりました。

また、CodeBlock 側で受ける Props の型指定でも時間を取ってしまいました。最終的には次の形にしました。

```typescript
type PropsType = React.HTMLProps<HTMLElement> & { node?: Node }
    & { children?: JSX.Element[] };
```

上記は３つの部分で構成されています。最初の部分は子要素としてありがちなので良いですが、２番目は気がつかなかった部分です。
この中の型 Node は別に定義してやりました。本来は node_modules/@types/unist から持って来るべきかも知れませんが、
どうも上手く行きませんでしたので、写経しました。

unist/Node が必要との情報は Mr. Christian Murphy が質問に答えている中に記述がありました。
元ネタは下記にあります。

<br />

[ChristianMurphyの回答](https://githubmemory.com/repo/remarkjs/react-remark/issues/6)

<br />

３番目の部分は 目的の子要素に対応する部分で、これは JSX.Element の配列として定義しています。

<br />

もう一つ不便な点がありました。

Syntax Highlighter にプログラミング言語を指定する目的でバッククオート直後に`javascript` とか言語名を記述します。
それと同時にファイル名や、行番号表示の要否を指定してやりたいのが人情です。
最初のプログラミング言語の指定部分は language- が先頭に付き、className の部分に入ります。
２番目以降の要素はまとめて文字列として `data-meta` の中に入ります。
まず困ったのはこのキー名である data-meta はピリオドの後に記述できない事です。

<br />

即ち下記の記述は使えません。

```typescript
const parameterStrings = props.children[0].props.data-meta;
```

これは下記のように記述して実現しましたが、他にもやり方はあるかも知れません。

```typescript
const parameterStrings = props.children[0].props[data-meta];
```

これで必要な情報を取得する事ができました。
この機能を使った オレオレ拡張版 Markdown は回を改めて紹介します。

-----

TypeScript が普及してきていますが、100% ではないので、他所から持って来た場合に苦労する事があります。
よく言われるように「型パズル」のような要素がありますが、TypeScript を使っていると型を明確にする気持ちが働き、
結果的に後々トラブルが減るメリットは確かにあります。最初手間の掛かる部分はありますが、効果はあると思います。
