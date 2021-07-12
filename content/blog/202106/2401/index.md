---
title: 数式が書けない
date: "2021-06-24"
update: "2021-07-02"
description: "以前からタマにLatexで数式を書くことがありました。このブログでも数式を使いたいと思い挑戦しましたが、結局先送りする事になりました。その顛末を晒します。"
tags: [Gatsby, MDX]
table: true
hero: ./katex.png
---
お断り：他にも原因がありましたが、この不具合に端を発して最終的には mdx を諦め、普通の md にしました。
従って下記の記述は現在のサイトの現状を反映していません。
mdx を諦めたお陰で、数式を記述できるようになりました。

<br />

$
R_{\mu\nu} - \frac{1}{2} g_{\mu\nu} R =
\frac{8\pi G}{c^2} T_{\mu\nu}
$

<br />

-----

TL;DR 　お急ぎの方へ；

現時点では gatsby-plugin-mdx の環境では gatsby-remark-katex は動きません。

どうしてもすぐに gatsby-remark-katex を使いたい場合は mdx を諦めて素の md である gatsby-transformer-remark をお使いください。

-----

しばらく前から困っていることがあります。Katex を使って数式を書きたいのですが、上手く行きません。

環境は次の通りです。

| Package | Version |
|---------|---------|
| node|14.15.3|
| npm|7.17.0|
| gatsby|3.6.1|
| react|17.0.2|
| gatsby-plugin-mdx | 2.6.0 |
| gatsby-remark-katex | 5.5.0 |

# 問題探し

gatsby-config.js は本家マニュアルに従い下記の通り

```javascript
plugins: [
  {
    resolve: `gatsby-plugin-mdx`,
    options: {
      gatsbyRemarkPlugins: [
        {
          resolve: `gatsby-remark-katex`,
          options: {
              strict: `ignore`
          }
        }
      ],
    },
  },
]
```

gatsby develop すると下記のエラーが、、

```bash
warn [remark-math] Warning: please upgrade to remark 13 to use this plugin
```

# 謎解き開始

ネットでは色々な情報が飛び交っています。mdx では katex がマトモに動かないと言う記事を見たことがありますが、その理由までは探し切れていませんでした。
また、環境や条件によって原因は異なるかも知れません。下記に報告する内容が唯一の原因でも無いかも知れません。

まず、remark 13 とは何かと言う所から。

Gatsby では豊富なプラグインのお陰で remark と言う物を意識することがありません。
実は remark と rehype と言うのは Markdown テキストを扱う基本の仕掛けです。
remark の方は Markdown を、rehype の方は HTML を扱います。
Markdown で書かれたブログはこれらのお陰で HTML に変換されています。
Gatsby では意識する必要なありませんでしたが Nextjs でブログを作る場合はこの辺りをよく理解しないと作れないでしょう。

変換作業は次の順序で行われます。Gatsby の場合は Plugin がゴニョゴニョしてくれますので、普通は意識しません。

| Package | 働き |
|---------|---------|
| remark-parse | Markdown形式を解釈、抽象構文木(mdast)に変換する |
| remark-rehype | 抽象構文木(mdast)を抽象構文木(hast)に変換する |
| rehype-stringify | 抽象構文木(hast)を文字列(HTML)に直列化する |

（余談ですが、「好文木」と聞いて最初はお線香かと思いました。　合掌。。）

remark-parse は上記エラーメッセージに見える「remark」と言いうパッケージに含まれる物です。
なお、エラーメッセージに見られる remark-math は抽象構文木(mdast)を、シグマ(Σ)だとかインテグラルとか、数学の記号として変換する仕掛けです。
どうやら remark-math は remark-parse の出力した抽象構文木(mdast)が気に食わない様子です。

# 調査

remark 13 にしろと言うのであれば、今はどうなの？と調べた所。。

```json
"gatsby-plugin-mdx": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/gatsby-plugin-mdx/-/gatsby-plugin-mdx-2.6.0.tgz",
      "integrity": "sha512-8AhLjE2GHMi6hECV3J1ZLzUPf/UZTGSPRXODBm6Ey8UP8FSfgSGPrg/mgPIFEywP1ndAuz0DhjmDv41tfn9BmQ==",
      "requires": {
        "@babel/core": "^7.12.3",
        // 省略
        "pretty-bytes": "^5.3.0",
        "remark": "^10.0.1",
        "remark-retext": "^3.1.3",
        // 省略
      }
```

gatsby-plugin-mdx が依存しているのは remark 10 のようです。 これで原因はわかりました。

# GitHubの調査

ではなぜ現行最新版のはずが要求に合わないかを調べて見たところ、色々な発見がありました。
remark と言うのは別に Gatsby 専用の物ではなく、[unified](https://unifiedjs.com/learn/guide/introduction-to-unified/)　の物です。

remark の方は順次アップデートされ、gatsby もそれに合わせて関連するパッケージをアップデートしています。

数式を扱う gatsby-remark-katex は約１ヶ月前に remark v13 に対応して v5.5 になりました。
所が問題は gatsby-plugin-mdx の方の対応が遅れている様子です。

詳しくは [MDX v2: ☂️ Umbrella issue #1041](https://github.com/mdx-js/mdx/issues/1041) を参照ください。

そしてその原因は @mdxjs/mdx にあるようです。 @mdxjs/mdx はこれまた gatsby専用の物ではありませんし、gatsby が直接何かをしている訳ではありません。
これ自身は mdxjs.com と言うところが担当しています。

# さあ、どうしよう

特に Markdown ファイルの中で JSX を直接使っている訳ではありませんが、このブログ自身は gatsby-plugin-mdx を元に組み立てています。
数式を書く事は現時点では頻度は極めて少ないですが、欲しい機能です。

問題は gatsby-plugin-mdx がいつになったら remark v13 に対応するか？と言う点です。
残念ながらずいぶん時間が掛かっているようで、リリース間近とはとても思えない様子です。

数式と言う点だけ見れば、それほど優先度は高くないのが実態で、gatsby-plugin-mdx の対応を待っても構いません。
それより違う視点でみた時、MDX を使うべきか？あるいはその必要があるか？を考える所があります。

<br />

できればコンテンツは何処か別の場所におきたいと思います。深く検討した訳ではありませんが、CMS を使う場合 JSX は扱いにくいことが予想されます。
また、JSX をコンテンツの一部にする必要性は（今の使い方を前提にした場合）高いとは思えません。

<br />

次の観点は mdx に対する Gatsby の関わり方です。別に政治的な駆け引きと言うほどでは無いにしても、mdx は　Vercel が相対的に強い立場にあるようです。
Gatsby をこれからも使う事を前提とした場合、将来的に mdx が使いやすいかどうかが懸念されます。Vercel としては Nextjs を伸ばしたいでしょう。

<br />

gatsby-plugin-mdx は gatsby-transformer-remark に mdx を付けただけではなく、結構違いがあります。
今、運用しているブログを gatsby-transformer-remark に切り替えるだけでもある程度の作業時間が予想されます。

-----

機会があったので、Nextjs も触ってみました。ブログと言う用途だけを考えた時、下記のような顕著な違いがあります。

<br />

- Nextjs には starter も Plugin もありませんので自分で組み立てる要素が多いです。
- Gatsby は良くも悪くも Plugin が頼りであり、それが同時に Gatsby を利用する上での機能的な限界になります。
- Gatsby と違い Nextjs は GraphQLで操れる訳ではなく、fs.read の世界から組み立てる必要があります。これはずいぶん面倒です。
- Nextjs の場合、Gatsby のように爆速でブログを作る事は事実上難しいと思われます。
- デプロイ局面を考えると更に異なります。これは Nextjs の想定デプロイ先が vercel である事に起因します。

<br />

ブログ以外の点に関しては別の長所短所があるでしょう。色々と知って置くことは実力のうちですから、これからも触角を伸ばして行きます。

<br />

追記：１週間ほど掛けて mdx を剥がして md ベースの仕掛けに作り替えました。結構手間でした。
