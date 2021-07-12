---
title: CodeBlock 活用
date: "2021-07-07"
update: "2021-07-07"
description: "Code Block を色々な用途に使おうとしています。Markdown は文字に色を付けたりする機能がありませんし、グラフも書けません。
この点を解決する方法を模索したいと思います。"
tags: [Gatsby, React, Markdown]
table: true
hero: ./chartjs.png
---
# 活用

Markdown は簡単に書ける事がメリットです。しかし表現力と言う点でやはり致し方ない制約があります。
だからと言って HTML / css でグリグリ書くのは勘弁して欲しいと言うのが本音です。
Markdown の使い勝手を生かして、必要な時に何らかの拡張が施されて表現力が強化できればそれに越した事がありません。

<br />

これがまさに Markdown に方言が入り込む余地であり、私も オレオレ Markdown を考える動機です。
拡張するにも Markdown の根本を変えてしまうような暴挙は避けるべきでしょうから、判断が難しい所です。

<br />

拡張は次の方法が考えられます。

* Markdown の文法レベルで追加し、remark のプラグインで拡張する方法
* React コンポーネントを作って rehype-react で組み込む方法
* rehype プラグインで機能を持たせる方法
* バッククオート３個で囲まれた部分は治外法権と考え、この部分に独自機能を実装する方法

<br />

ブログを書くに当たってどのような表現力が欲しいか？と言うと下記のような要求が考えられます。

1. Syntax Highlighter
1. グラフを表示する機能
1. Markdown 組込よりも高機能な表（テーブル）
1. UML やその他ブロック図描画機能
1. Katex 等で数式を書く機能
1. 画像の表示に関する細かな調整
1. センテンスに色を付け、注目を促す

<br />

１番目の Syntax Highlighter は VS Code や各種 IDE では常識で、この要求は外せません。
Gatsby のプラグインもありますが、ちょっと機能不足ですから、真っ先にこれが槍玉に上がります。

<br />

２番目のグラフは jpg 化した物を貼り付ける形でも構わないでしょうが、これもできれば何とかしたい機能です。

<br />

３番目、やれば出来ない物ではありませんが、あまり強い要求ではありません。やるとすると、HTML に変換された後で化粧してやる方法が現実的だと思われます。
tableタグを何らかのコンポーネントに関連付け、処理してやれば可能です。

<br />

４番目は面白そうです。必要性が低いので、先送りします。

<br />

５番目の数式は Gatsby のプラグインで実現出来ました。

$
\int^{b}_{a} f(x) dx
$

<br />

６番目も Gatsby のプラグインで実現出来ました。

```plain
gatsby-remark-extract-image-attributes
gatsby-remark-images-insert-wrapper-attributes
```

<br />

７番目は大した作業でもなさそうですから、実現しようと思います。

<br />

上記の拡張を総合的に眺めた時、ポイントとなりそうなのは次の点です。

* パラメータの賢い取り扱い
* グラフを描く仕組みの導入

# minimist

例えば Syntax Highlighter を使う場合、次のような指定をしたくなります。

```plain
javascript --title=gatsby-config.js --line
  --number=1,2-4,5-7 --height=200px
```

つまりコマンドラインのような形で指定できれば良い感じになります。
探して見たら Argument を取り扱ってくれる仕掛けは想像の違わず世の中に沢山ありました。
まず目についたのが、commander とか yargs とか豪華な仕掛けでしたが、問題がありました。

* commander も yargs もちょっと豪華すぎる
* Webpack 5 に対応するために一手間かかる

<br />

最終的に使ったのは __minimist__ と言うツールで規模も機能もピッタリで、Webpack の問題もありません。
Unix (Linux) のコマンドラインのような使い方が実現できます。

<br />

設定は下記のようにします

```typescript
const parseOption = {
  string: ['title', 'number', 'height', 'width'],
  boolean: ['line'],
  alias: {
    t: 'title',
    l: 'line',
    n: 'number',
    h: 'height',
    w: 'width',
  },
  default: {
    title: '',
    line: false,
    number: '',
    height: '200px',
    width: '300px',
  },
};
```

使い方は parseArgs 関数の第一引数に入力文字列、第二引数に上記のオプション指定を入れます。

```typescript
const argv = parseArgs(paramArray, parseOption);
const title = argv.title;
// 略
```
parseArgs の出力がオブジェクトになっており、キーを指定して目的のパラメータが取り出せます。

問題は、上記のような場合、argv.title が単一の文字列なのか、文字列の配列なのかが分からない事です。
minimist は重複する指定があった場合、それを配列の中に入れて返してくれます。重複が無い場合は配列にはしません。

```bash
javascript --title=gatsby-config.js -t hoge.js --title=piyo.tsx ...
```

故意か過失か上記のように重複した指定をした場合 argv.title は要素数３の配列になります。ちょっとこれは困ります。
配列なら最初の要素を、そうでなければそれ自身を返す関数を作り、それを潜らせる必要があります。
さもないと Gatsby の build で実行時エラーが出ます。
文字列の配列か、単一の文字列かは length で検出できませんので違う方法を使います。

```typescript
const getSingle = <T,>(arg: T | T[]): T => (Array.isArray(arg) ? arg[0] : arg);
```

配列かそうで無いかは Array.isArray を使って検出します。

ジェネリックを使っていますが、`<T,>` とコンマが付いている事に注目してください。このコンマは必要です。
ファイルの拡張子が .ts の場合は問題がありませんが、JSX を含む .tsx の場合問題がおこります。
TypeScript は `<T>` に対応する終了タグ `</T>` が見つからないのでエラーを吐きます。それを避けるためにコンマを入れています。
知られているようで知られていないテクのようです。

<br />

```notice --background=#FFEEFF --color=red --font=14px
.tsx プログラムの中でジェネリックを使う場合は <T,> のようにコンマを入れる
```

# Chart.js

バッククオート３つで囲んだら Syntax Highlighter であれ何であれ同じロジックでゴニョゴニョできます。
実際にどれほどの需要があるか分かりませんが、仕掛けは簡単に実装できますので、react-chart-2 を入れてグラフが描けるようにしました。

<br />

[react-chart-2](http://reactchartjs.github.io/react-chartjs-2/#/)

<br />

Chart.js は中々高機能で、パラメータ、オプションを詳細に指定できます。

戦略として２通り考えられます。

* バッククオート３個のブロックの中の記述を簡単にするやり方（簡易版）
* このブロックにありとあらゆる指定ができるようにする戦略（豪華版）

## 簡易版

```markup
//```chart --height=200px --width=200px
{
  "graph": {
    "type": "line",
    "dataBlock": {
      "label": "This is a Chart",
      "labels":  ["1", "2", "3", "4", "5", "6"],
      "data": [1.1, 2.1, 3.1, 5.3, 6.1, 4.4]
    }
  }
}
//```
```

```chart --height=200px --width=200px
{
  "graph": {
    "type": "line",
    "dataBlock": {
      "label": "This is a Chart",
      "labels":  ["1", "2", "3", "4", "5", "6"],
      "data": [1.1, 2.1, 3.1, 5.3, 6.1, 4.4]
    }
  }
}
```

Chart を実際に書くプログラムの部分の詳細は省略しますが、
やっていることは簡単で、コードを JSON.parse して必要な要素を取り出して React コンポーネント Chart でグラフにしているだけです。

この戦略の良い点は簡単に書けることですが、Chartjs の高機能が生きません。

## 豪華版

どうせ JSON を書くのであれば、そのまま Chartjs に渡せる物を書いても良い訳です。
ちょっと面倒ですが、下記のような記述です。

```markup
//```graph --height=200px --width=200px
{
  "graph": {
    "type": "bar",
    "data": {
      "labels": ["1", "2", "3", "4", "5", "6"],
      "datasets": [
        {
          "label": "This is a Graph",
          "backgroundColor": "rgba(30, 144, 255, 1)",
          "borderColor": "rgba(30, 144, 255, 1)",
          "data": [1.1, 2.1, 3.1, 5.3, 6.1, 4.4]
        }
      ]
    },
    "options": {
      "responsive": false
    }
  }
}
//```
```

実際に書くとこんな結果です。

```graph --height=200px --width=200px
{
  "graph": {
    "type": "bar",
    "data": {
      "labels": ["1", "2", "3", "4", "5", "6"],
      "datasets": [
        {
          "label": "This is a Graph",
          "backgroundColor": "rgba(30, 144, 255, 1)",
          "borderColor": "rgba(30, 144, 255, 1)",
          "data": [1.1, 2.1, 3.1, 5.3, 6.1, 4.4]
        }
      ]
    },
    "options": {
      "responsive": false
    }
  }
}
```
豪華版の方は実装は簡単で、JSON.parse したものをそのまま Chartjs に食べさせるだけです。
しかし JSON を間違いなく手書きすると言うのは結構大変で、Markdown 原稿を書く時が面倒です。
JSON は結構厳格で、オンラインで構文をチェックできる仕掛けもありますのでそのような道具を使ってしっかり書きます。
でも繰り返しますが、面倒です。

<br />

[JsonLint](https://jsonlint.com)

<br />

JSON の記述にミスがあると、エラーの嵐になります。

<br />

どちらの方法も長所も短所もありますので、２つとも実装しました。

# Eye-catch

Markdown は基本的にはモノクロの世界です。ちょっと目を引く表示をする時に下記のような細工ができると便利です。
これも一連の仕掛けで簡単に実装出来ます。Syntax Highlighter より数倍簡単です。

```notice --background=#FFEEFF --color=red --font=16px
阪神タイガースは、シーズンの最初は良いのですが、いつもなぜか途中から負けが多くなります。
矢野監督は頭が痛いでしょう。
```

<br />

いつも Syntax Highlighter が必要無いので、場合によってはこんな表示も便利だと思います。

等幅フォントを使った何の装飾もないタダの表示です。

```plain
これはなんの装飾もない表示です
type Props = {
  pageName: string;
  nodes: nodeType[];
};
```

# Syntax Highlight

すでにこのページに登場しましたが、素の Prism を拡張し、下記の設定を受け付けます。

|  パラメータ  | 　指定   | Default  |
|:---|:--|---|
|ファイル名|--title|空白|
|行番号表示|--line|false|
|開始行番号|--start|1|
|ハイライト番号|--number|なし|
|高さ|--height|200px|
|幅|--width|300px|

<br />

この部分は一種の力技のような物で、プログラミング的には特別な事はしていません。

<br />

Syntax Highlighter は Prism に限らず、shiki とか、あるいは他の物もあります。
今回 Prism を選択したのは特に大きな理由があった訳ではありません。機会があれば他の Highlighter も使って見たいと思います。
あえて Prism を選んだ理由と言えば、ネット上落ちている情報が豊富だった事と言えます。

バックグラウンド色を変えて強調表示する行を指定できるようにしています。

```plain
--number=1,2-4,10-12,15,35
```
と言う指定を
```plain
[1,2,3,4,10,11,12,15,35]
```
と言う配列に変換する仕掛けは `parse-numeric-range` と言う仕掛けを使っています。
あまり特筆する物はありませんが、素直に便利です。

# 夢は大きく

最初は Syntax Highlighter だけでしたが、欲張り爺さんをしてしまいました。
しかし人間は基本的に欲が深いもので、将来取り組んでみたい要素は次の通りです。

* 欲その１：Mermaid を入れる
* 欲その２：３次元グラフが書ける仕掛けを使いたい

Mermaid はチャートを書いてくれる仕掛けで、フローチャートやガントチャートが書けます。
react と連携する package も世の中に何種類かあるようですが、メンテナンスの状態が芳しくなかったりで二の足を踏んでいます。
世の中に無いんだったら作っても良いかと思える規模です。

３次元グラフは単にカッコイイという不純な動機で、必要性が出た時に考えれば良しにしておきます。

<br />

よく言われている事ですが、エンジニアが自分の気に入ったブログを作るとついつい凝ってしまって本業に影響があるとか。
要求元が自分で、開発者が自分で、大体の物は自分で作れてしまいますので、オレによるオレのためのオレのブログになります。
当面は GitHub Actions + Netlify で運営しますが、将来レンタルサーバに引っ越すかも知れません。
また現状は外部の CMS を使っていませんが、これも将来採用するかも知れません。

もう少し整理できたら Gatsby で作ったシステム全体を GitHub で晒し、解説を書こうかと思います。
また、これも出来たらという世界ですが、この結果を starter にまとめて使いやすくしたいと思います。
また色々と報告したいと思いますので、これからもお付き合いください。
