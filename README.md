<h1 align="center">
  <img width="196" height="196" src="https://raw.githubusercontent.com/lichtquelle/wanilla/main/readme/wanilla-logo-512.png">
</h1>

<h3 align="center">
  A 2 kB JQuery like <b>W</b>rapper around <b>Vanilla</b> JavaScript.
</h3>

<p align="center">  
  <!-- <img src="https://badgen.net/badgesize/gzip/lichtquelle/wanilla/main/bundles/wanilla.min.js?style=flat-square" alt="gzip size"> -->
  <img alt="npm" src="https://img.shields.io/npm/v/wanilla?style=flat-square">
</p>

<hr>

## Video

Watch an introduction of the `Include Tag` of Wanilla on [YouTube](https://youtu.be/UbXaGvjI8l8).

## About

wanilla adds super power to your HTMLElements. Each element wrapped with wanilla will still remain a HTMLElement, but has some cool and easy to use new features.

wanilla also provides a easy way to include other HTML files. You can, for example, easily include your menu or footer as external files.

## Import Library

```html
<!-- Get Wanilla from jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/wanilla/bundle/wanilla.min.js"></script>

<!-- Get Wanilla from UNPKG -->
<script src="https://unpkg.com/wanilla/bundle/wanilla.min.js"></script>
```

```js
// Get Wanilla from NPM
> npm i wanilla

// include W as default
import W from 'wanilla'

// include the types (if you use typescript)
import { WElement, WInputElement, WBase } from 'wanilla'
```

## Usage

- If 2 or more parameters are given to `W()`, it will create a new HTMLElement.
- If only one parameter is given to `W()`, it will querySelect the first matching element.
- To get an array of matching HTMLElements, use `W.all()`.

### Simple Example

```js
// use the library after page load
window.addEventListener('load', () => {
  // create <h1 id="title" class="big" >The Title</h1>
  const h1 = W('h1', { id: 'title', class: 'big' }, 'The Title')

  // get the body element
  const body = W('body')

  // append h1 to body
  body.appendChild(h1)
  // same as
  h1.appendTo(body)

  // change color
  h1.css.set('color', 'red')
})
```

## Chaining Example

The script below transforms this:

```html
<div id="container"></div>
```

Into this:

```html
<div id="container">
  <h2 style="border: 2px solid yellow; padding: 8px 16px;">
    <span style="color: red;">first span</span><span style="color: lightblue;">second span</span>
  </h2>
</div>
```

```js
// script.js
W('#container')
  .set.HTML('<h2><span>first span</span><span>second span</span></h2>')
  .get.firstChild()
  .css.set('border', '2px yellow solid')
  .css.set('padding', '8px 16px')
  .get.firstChild()
  .css.set('color', 'red')
  .get.nextSibling()
  .css.set('color', 'lightblue')
```

### Include Example

wanilla can easily include other HTML files.

```html
<!-- index.html -->
<body>
  <include-html src="/feature.html" title="some title">placeholder...</include-html>
</body>

<script>
  window.addEventListener('load', () => {
    W.autoInclude()
  })
</script>

<!-- feature.html -->
<div>
  <h2>Some dynamic {TITLE}</h2>
  <p>Hello from feature component</p>
</div>

<!-- after rendering, your index.html page looks like this -->
<body>
  <div>
    <h2>Some dynamic some title</h2>
    <p>Hello from feature component</p>
  </div>
</body>
```

The feature.html page could even include a CSS file which will automatically be added to the DOM.

```html
<!-- feature.html with its own css file -->
<include-css src="/feature.css"></include-css>

<div id="feature">
  <h2>Some dynamic {TITLE}</h2>
  <p>Hello from feature component</p>
</div>
```

## SSR

You can easily pre-render all your HTML files using the [generate-static-site](https://www.npmjs.com/package/generate-static-site) package.

## More

There are of course a lot more things you can do, which will be documented soon.

Actually, instead of writing better documentation, I believe, I will rather create a website with some examples. And since this project is part of the [licht project](https://licht.dev/), I will probably add it there.
