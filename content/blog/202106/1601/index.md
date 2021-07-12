---
title: Hamburger Icon
date: "2021-06-16"
update: "2021-07-02"
description: "Hamburger Icon はメニュー表示を起動する目的でよく使われています。多くのサイトの右上当たりに配置されます。React で使える物を紹介します。"
tags: [Gatsby, React]
table: true
hero: ./burger.png
---
チョット画面幅を小さくしてみてください（960px以下）。右上に現れるのがハンバーガーアイコンです。

ハンバーガーアイコンは「非常口」や「トイレ」のピクトグラム同様、ほとんどの人にとって見ただけで意味が分かるまでに普及しています。
先日、ネット上で「ハンバーガーメニューはもう古い」と言う記事を見ました。これはあまりに行き渡りすぎて食傷気味なのかも知れません。
とは行っても「非常口」や「トイレ」のピクトグラムに食傷気味になることは無いと思いますが。。

ではどの程度古いの？という好奇心からその根源を調べて見ました。これも一杯情報がありましたが、
<br />

> Its graphic design was meant to be very “road sign” simple,
> functionally memorable, and mimic the look of the resulting displayed menu list.
> With so few pixels to work with, it had to be very distinct, yet simple.
> I think we only had 16×16 pixels to render the image.
> (or possibly 13×13… can’t remember exactly)

<br />
最初は Xerox Star に採用され、上記の引用は同機の開発者の一人 Mr. Norm Cox のメールに有った様です。
これがなんと 1981年、ということは 40年前！今バリバリのフロントエンドエンジニアの生まれる前。。そりゃ古いはなぁ。。

# React での実現

ネットを見ると HamBurger Icon の書き方は山ほどあり、中にはクリックすると形を変え、３本線がバツ印になるものもあります。ほとんど CSS だけで実現されている様です。

起動されるメニュー部分を含めてもうチョット簡単にサクッと実現できないかと思って探した所、これまた沢山有りました。React に限定しただけでも下記のような物が有ります。
<br />

* React aria offcanvas
* React Animated Burgers
* React Burger Menu
* Animated Burgers
* React Hamburgers
* React Hamburger Menu
* Reactjs Popup Burger Menu
* React CSS Burger
* React Hamburger Button
* HamburgerIcon
* などなど。。

<br />

全部を評価する訳にも行かないので、サンプルを見てエイヤで React Burger Menu と言うのを選びました。

<br />

[デモはこちらです](http://negomi.github.io/react-burger-menu/)

<br />
１０種類のアニメーションの内、３種類のアニメーションが簡単に使えます。それほど大変な手間でも無いですが、後の７種類は少しだけやることが増えます。

# 実装

環境

| Package | Version |
|---------|---------|
| node|14.15.3|
| npm|7.17.0|
| gatsby|3.6.1|
| react|17.0.2|

インストール

```bash
npm install react-burger-menu
```

TypeScriptの場合は下記もインストールします。

```bash
npm install -D @types/react-burger-menu
```

今回導入したバージョンは次の通り。

| Package | Version |
|---------|---------|
| react-burger-menu | 3.0.6 |
| @types/react-burger-menu | 2.8.0 |

gatsby-config.js への設定は必要有りません。実装は次の通りです。

<br />

```javascript
import { slide as Burger } from 'react-burger-menu';
export const Menu = () => {
  return (
      <Burger>
        <a href="/">Home</a>
        // ... 省略
      </Burger>
  );
}
```

なお、a タグの代わりに gatsby の Link でも構いません。また、この部分で別のコンポーネントを呼び、呼ばれたコンポーネントからリンクしても構いません。
上記の例では default export をしていませんが、どちらでも構いません。ページの先頭か先頭部分の nav で上記のコンポーネントを呼びます。
１０種類の内、３種類（slide,stack,bubble）のアニメーションに関してはコレだけで OK です。
アニメーションの種類は import する時に指定します。上記の例では slide を使っています。簡単ですねぇ。

# 凝ったアニメーション

他の７種類（elastic,push,pushRotate,scaleDown,scaleRotate,fallDown,reveal）はもう一手間必要です。
理由はメニュー部分のみならずページ全体にアニメーションを効かせるからです。

上記の Menu の部分を作る所までは同じですが、これを呼ぶ場所の内外両方で div タグを作って id を設定してこの id を Menu の Props として指定する必要が有ります。

<br />

```javascript
  import { Menu } from '../component/menu';
  ...
  return (
    <div id="outer-container">
      <Menu pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } />
      <div id="page-wrap">
        .
        .
        .
      </div>
    </div>
  );
```

今回紹介はしませんが、指定出来るオプションは沢山あります。もちろん好みのアイコンを指定できます。
内部のクラス名が公開されていますので、それを使って CSS を指定します。サンプルはサイトに公開されていますので、それを適当に変更してやれば OK です。

-----

凝ったアニメーションまでは必要なかったので、bubble を使って簡単にサクッと実装しました。見かけの挙動が面白いのでコレで良いかと思っています。
まるで風船が膨らんで割れたらメニューが現れると言うイメージです。

<br />

所で日本は世界で最初にピクトグラムを広めた国だそうです。1964年の東京オリンピックの時、各国の言語で表現するのは困難なので絵で表現する方法を取りました。
今年はどうなることやら。。
