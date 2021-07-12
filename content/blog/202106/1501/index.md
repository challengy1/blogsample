---
title: CSSよ、お前はどこから？
date: "2021-06-15"
update: "2021-06-15"
description: "出自不明のCSSよ、お前はどこから来たのだ。俺はお前を指定した覚えはないし、cssファイルにもお前を書いている物はない。さて？"
tags: [Gatsby, CSS]
table: true
hero: ./css-logo.png
---
Markdownで書いた表がカッコ悪い。左端と右端が詰まっている。この状況は何とかしたいです。

__Before__

![Before](./table.png?align=left)

Chromeの開発ツールで見ると次の記述が見えます。

```css
table td:first-child,
table th:first-child{
  padding-left: 0;
}
```

ん？こんな記述をした覚えはない。。

# 謎解き開始

gatsby-browser.js は下記の通り。

```javascript
import 'normalize.css';
import './src/style/style.css';
```

normalize.css を調べてもリセット動作以外のことはしていないし、 ２番目の CSS ファイルは自前で書いた物だがそんな記述はしていません。
第一、最初の子だとか末っ子だとかそんなムズカシくて面倒なことはめったに考えません。

更に Chrome の開発ツールのお世話になって隈なく調べたが、CSS ファイルの名前ではなく(index):1 の記述。
確かに`<head>`の中に`<style>`指定があり、この中に記述がありました。

<br />

```markup --line --number=1
<style id="typography.js">
  (...省略...)
  th:first-child,td:first-child {
    padding-left: 0;
  }
  th:last-child,td:last-child {
    padding-right: 0;
  }
</style>
```

# typographyが臭い

1 行目に `id="typography.js"` の文字がある。やったのはお前か？

確かに gatsby-plugin-typography はインストールしました。node_modules/gatsby-plugin-typography の中を探したが CSS は存在しません。
ただ、typography が臭いことはほぼ明らかです。理由は Google Font の指定をしている所が同じファイルにあります。
Google Font の指定は typography 以外ではしていません。

```css
html {
  font: 100%/1.45 'M PLUS 1p','Roboto',serif;
  box-sizing: border-box;
  overflow-y: scroll;
}
```

react-typography か？　しかしそこにも CSS はありません。では誰がどこで設定しているの？？

# typography捜索

node_modules/typography というディレクトリを見つけたのでガサ入れをしてみました。ここにも CSS ファイルはない。。
だが、犯人はそこに居ました！！

node_modules/typography/src/createStyle.js で CSS を作っていたのでした。

```javascript
export default (vr: any, options: OptionsType) => {
  let styles = {}
  const { fontSize, lineHeight } = vr.establishBaseline()
  // ...
  // 省略
  // ...
  styles = setStyles(styles, "th:first-child,td:first-child", {
    paddingLeft: 0,
  })
  styles = setStyles(styles, "th:last-child,td:last-child", {
    paddingRight: 0,
  })
```
頭から尻尾の先まで合計 283 行のファイルでその最後の方に記述されていた〜！

# で、どうする？

まさか node_modules/typography/src/createStyle.js を改ざんする訳にも行きません。
よしんばそれをしたとしても次のアップデートで戻ってしまいます。また、GitHub Actions なんかでビルドする事を考えると意味がありません。

ほんとは createStyle.js さんに動いて欲しくないのですが。。CSS 設定を上書きする仕組みはある様ですが、丸ごと止めることはどうもできなさそうです。

仕方ないので、自分で書く CSS の中で、これに対応する記述をすることにした。

```css
table td:first-child,
table th:first-child,
table td:last-child,
table th:last-child {
    padding: 6px 13px 6px 13px;
    border: 1px solid #dfe2e5;
}
```
!important の指定はしていませんが、こちらが有効になってくれました。


__After__

| Package | Version |
|---------|---------|
| node|14.15.3|
| npm|7.17.0|
| gatsby|3.6.1|
| react|17.0.2|

これで表の見え方がずいぶんとマシになったので、これでよしとしておきます。

-----

犯人は思わぬ所に潜んでいました。ハマった場合に自分が今突いている所に問題が無い場合が多いようです。
コンパイル対象になっていないファイルを一生懸命デバッグして結果が変わらず頭を抱えたり、CSS のカスケードを忘れたり、あるいは思わぬ所に原因があった経験はどなたもお持ちでしょう。
ハマる度にエンジニアは経験値が増えますが、先入観も増えているのかも知れません。

教訓、もし typography を使っていて CSS 上の問題が発生した場合、node_modules/typography/src/createStyle.js の中身を調べて見るとヒントがあるかも知れない。
皆さんの謎解きのお役に立つことができれば幸いです。
しかしもう少し根本を考えた場合、typography は必要なの？と言う疑問が湧きます。私は、そしておそらく日本の多く方が、Google Font を欲しくて採用されているように思えます。
それはそれで良いのですが、typography はフォントためだけに使うのはちょっとやり過ぎのように思えます。

しかし残念ながら良い代替案もなさそうです。typography を使う場合は身に覚えのない css に遭遇する可能性もあります。

ハマった経験はこれからも共有して行きます。
