---
title: Table Of Contents
date: "2021-06-11"
update: "2021-07-02"
description: "技術系ブログに目次機能を付加する方法を紹介します。目次はその時点の購読範囲を示し、目次項目のクリックでその場所に飛べる機能を搭載します"
tags: [Gatsby, TypeScript]
table: true
hero: ./index.png
---
お断り：この記事を書いた時点では mdx でブログを作りましたが、その後普通の md (Remark) に変更しました。
この記事の内容は最新の状態を反映していませんが、 mdx で作られえる場合は参考にして頂けると思います。Remark 版は追って紹介したいと思います。
<br />
__大きくは変わりませんが、目次の生成が mdx の場合と md の場合では異なります。__

# (1)技術系ブログの目次
記事が長く、内容が幅広いほど目次機能が欲しくなります。望むべくはその目次が常に見える状態にあることです。

更に言うと次の機能が欲しくなります。
- 目次が現在読んでいる範囲を示してくれること
- 目次をクリックするとその場所にジャンプして表示してくるれこと

これら機能を実現する方法をご紹介します。

<br />

## (1-1)環境

次の環境を前提としています。(package.jsonの抜粋)
<br />
__※この時点は mdx でブログを作っていました。__

```json --title='package.json'
"@mdx-js/mdx": "^1.6.22",
"@mdx-js/react": "^1.6.22",
"gatsby": "^3.6.1",
"gatsby-plugin-mdx": "^2.6.0",
"react": "^17.0.2",
"typescript": "^4.3.2",
"gatsby-remark-autolink-headers": "^4.3.0",
```

<br />

Starterを使って __爆速__ でブログを作るのがGatsbyの「売り」の一つですが、条件にピッタリのStarterが無いので「素」から構築しました。
Starterを使って作り始めたのですが、作り直すのがかえって手間でしたので、素から作った言うのが本音です。
従って爆速で構築できた訳ではありませんが、それなりに好きな事ができました。
なお、gatsby v3.6.1 では脆弱性を示す警告が沢山出ますが、実際の完成形のサイトに影響があるものでは無さそうです。
調べた範囲では古い版のtrim()関数に起因する物でこれがあちこちに影響を与えています。気持ち悪いので早くなんとかして欲しい物です。
脆弱性の解消に npm audit fix が示唆されますが、これは無視して構いません。
<strong>npm audit fix --force はお勧めしません。やると偉い目に合います。</strong>

<br />

## (1-2)前提

今回は Markdown に JSX 拡張機能が欲しかったので、gatsby-plugin-mdx で構成しています。
自身で開発する部分は TypeScript を使いましたが、gatsby-*.js は Javascript のままにしています。

賛否があると思いますが、型を認識してコーディングした方が、（私に取っては）結局近道になる事が多かったので TypeScript を使っています。
詳細は触れませんが、ESLint, Prettier, StyleLint も使用しました。コレらも何らかのヒントを与えてくれるので、バカ避けになることがあります。

# (2)目次作成機能

大きく３つの要素があります。

1. 目次の項目（ Table of Contents ）抽出
1. 指定場所へのジャンプ機能
1. 購読中の場所の表示

最初は１だけを考えていましたが、次第に欲が出て３つとも実装することにしました。

<br />

## (2-1)項目抽出

gatsby-remark-autolink-headers を使って目次の項目を抽出しています。gatsby-remark-table-of-contents は使いませんでした。
gatsby-remark-table-of-contents は gatsby-remark-autolink-headers の結果を表示する物です。
今回は他の付加機能を追加するので、表示系は別途作ります。

gatsby-remark-autolink-headers は GraphQL の mdx の下に tableOfContents を作ってくれます。

<br />

```graphql --title=GraphQL --height=300px
    "mdx": {
      "slug": "test01",
      "tableOfContents": {
        "items": [
          {
            "url": "#this-is-a-text-to-test-md-processing",
            "title": "this is a text to test md processing",
            "items": [
              {
                "url": "#hello",
                "title": "Hello."
              }
            ]
          },
          {
            "url": "#chapter-2",
            "title": "Chapter 2",
            "items": [
              {
                "url": "#who-is-who",
                "title": "Who is who"
              },
              {
                "url": "#i-am-a-man-who-knows-everything",
                "title": "I am a man who knows everything"
              }
            ]
          }
        ]
      },
    }
  },
```
<br />

gatsby-remark-autolink-headers は HTML のヘッダタグを検出して、それを元に入れ子の（ネスティングされた）情報を生成します。
url と title がペアになった構造で、url はリンク先として、title は表示に使います。更に items があるとその下位に要素がある事を意味します。
ヘッダタグ（h1~h6）の入れ子構造がそのまま GraphQL の中身ですから再帰的に表示します。33行目で自分自身を呼んでいることがお分かり頂けると思います。

<br />

```typescript --title='TableList.tsx' --line --height=300px --number=27,33
const getIds = (items: ToC[]): string[] => {
  items.map((item) => {
    if (item.url) {
      acc.push(item.url.replace('#', ''));
    }
    if (item.items) {
      getIds(item.items);
    }
  });
  return acc;
};

const recursive = (items: ToC[]) => {
  const idList = getIds(items);
  const activeId = useActiveId(idList);
  return (
    <ul css={ulCss}>
      {items.map((item: ToC) => {
        return (
          <li css={liCss} key={item.url}>
            <Link
              to={item.url.replace('#', '')}
              smooth={true}
              offset={-50}
              duration={800}
              style={{
                color: activeId === item.url.replace('#', '') ? 'red' : 'blue',
                cursor: 'pointer',
              }}
            >
              {item.title}
            </Link>
            {item.items && recursive(item.items)}
          </li>
        );
      })}
    </ul>
  );
};

export const TableList: FC<Props> = ({ items }) => {
  return recursive(items);
};
```
TableListはReactコンポーネントですから、これを必要な場所で呼べばOKです。
なお、上記コードには表示の現在位置を目次に反映する機能も含まれますが、これは後述します。

<br />

関数 recursive は目次項目の再帰配列 items:ToC[] を引数として取ります。
items を map で回し、title と url を使って ul と li で JSX を組み立てます。
33行目で、その階層が更に下位の items を持っているかを判別し、持っていれば再帰呼び出しをします。

## (2-2)ジャンプ機能

21 ~ 32 行目は目次の項目をクリックされた時に指定された所に飛ぶ Link です。
スムーズに移動する方が心地良いので react-scroll の Link を使っています。
gatsby-remark-autolink-headers が生成したリンク先情報である url には先頭に「#」が付きますのでこれを剥がして to に与えています。
ul と li には css を指定していますが、今回 Emotion を使い、中身は素の CSS を使いました。所謂 UI キットを使っても良いでしょう。
27 行目の３項演算子は表示領域であれば文字の色を変える為の物です。

duration に与える数字が大きい方がマッタリと動きますので好みに合わせてください。

## (2-3)現在位置認識

ポイントとなるコードは次の通りです。

```typescript --height=300px --line --number=1,4,14-19
const useActiveId = (itemIds: string[]) => {
  const [activeId, setActiveId] = useState(`test`);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -70% 0%` },
    );
    itemIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });
    return () => {
      observer.disconnect();
    };
  }, [itemIds]);
  return activeId;
};
```

useEffect を使っています。これはこのコンポーネントがマウントされた時に実行して欲しいからです。

<br />

useEffect は第一引数にコールバック関数を指定します。コールバック関数内で4行目にある IntersectionObserver を使っています。
これは DOMエレメントを監視して、監視対象が表示範囲に入ったら activeId を変化させる働きをします。
監視対象は 1 行目の引数に入っている itemIds で、これは目次の各項目が入っている配列です。
14 行目から始まる forEach ループで配列の各要素の HTML エレメントを取り出し、observer.observeで監視対象にしています。
useEffect のコールバック関数の return はクリーンアップ関数で、このコンポーネントが unmount される時に呼ばれます。
この時、observer.disconnect() を呼び、全ての監視対象を外しています。このクリーンアップをしないとメモリーリークが発生します。

<br />

IntersectionObserver はブラウザの標準的な機能で、React だけの物ではなく、Vue などでも利用できますので、情報も一杯落ちています。
その中にはトラブルの報告も散見されますので紹介しておきます。

<br />

observer.observe 関数はエレメントを引数とします。エレメントは getElementById で取得しますが、これが失敗する場合があります。
その原因はコンポーネントのマウントが完了していないのにエレメントを取りに行った場合にエラーを吐きます。

アンマウント時にも問題発生の可能性があります。上記のコードは問題を解消した物ですが、変更前は getElementById でエレメントを取得して observer.unobserve を実行していました。
getElementById でエレメントを取得しようとした時すでにコンポーネントが unmount されていたので発生したようです。

<br />

変更前のコードは次の通りでした。コレはNGコードです。
```typescript --line
    return () => {
      itemIds.forEach((id) => {
        observer.unobserve(document.getElementById(id));
      });
    };
```

責任転嫁するつもりはありませんが、実はこのコードは下記のサイトを丸パクリした物でした。
ただしこのサイトは大変説明が分かりやすかったので URL を紹介しておきます。

<br />

[Adding a Table of Contents that updates on scroll](https://nickymeuleman.netlify.app/blog/table-of-contents)

<br />

stackoverflow にも同じようなコードがありました。丸パクリしたとしても、内容をキチンと理解して、自分で判断することが大切だと思います。

-----

目次機能は実装できました。しかし全ての記事が目次を必要とする訳ではないので、frontmatter 部分で目次を表示するかどうかを指定します。
あまり短い記事の場合、目次を表示する意味がありませんので、その場合は普通のサイドバーを表示するように切り替えます。
また画面幅が狭い場合は目次部分を表示していません。その代替としてポップアップしても良いのかも知れませんが、現状何もしていません。

<br />

一番ハマったのは unobserve の部分でした。再現性が低く中々現象が現れてくれませんでした。
改善を施してから相当回数実験して問題が発生しない事を確認しましたので大丈夫だと思います。

IntersectionObserver と getElementById を使って問題が発生した場合、コンポーネントのマウント・アンマウントのタイミングを調査したら、解決のヒントになるかも知れません。

追記：冒頭にもお断りした通り、目次機能も後日若干変更していますので、いずれご紹介します。
