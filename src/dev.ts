/**
 * docs:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 * https://www.w3schools.com/cssref/css_selectors.asp
 * https://www.w3schools.com/jquery/jquery_ref_selectors.asp
 *
 * tester:
 * https://www.w3schools.com/cssref/trysel.asp
 */

import W, { WElement } from './index'
import { VERSION } from './version'

W('#version').innerText = `Wanilla v${VERSION}`

// make custom extend
// interface FInputElement extends FBase, HTMLInputElement {}

// F.include(F('placeholder-example'), 'example.html', { title: '"the title"' })
// F.include('example', 'example.html', { title: '"the title"' })
W.autoInclude() // will include all <include-example> tags

window.addEventListener('load', () => {
  const span = W('span', null, 'hi from span')
  const h2 = W('p', { class: 'something' }, span, ' hello from textNode')
  W('h1').after(h2)
})

W('#container')
  .set.HTML('<h2><span>first span</span><span>second span</span></h2>')
  .get.firstChild()
  .css.set('border', '2px yellow solid')
  .css.set('padding', '8px 16px')
  .get.firstChild()
  .css.set('color', 'red')
  .get.nextSibling()
  .css.set('color', 'lightblue')

// manually include "custom-placeholder"
window.addEventListener('load', () => {
  // const placeholder = W('#custom-placeholder')
  // W.include(placeholder, 'example.html', { title: '"title 2"' })
  // console.log(placeholder)
})

W('div', {}, 'new element').appendTo(document.body).class.set('test')

const btn = W('#btn')
btn.css.add('font-size', '26px')

btn.on('click', () => {
  console.log('click (arrow)')
  console.log(this, btn) // undefined, btn
})

btn.on('click', function (this: WElement) {
  console.log('click (fnc)')
  console.log(this, btn) // btn, btn
})

const pause = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      return resolve()
    }, 2000)
  })
}

const waitWithPromise = (element: WElement, done: () => void) => {
  console.log('waitWithPromise')
  setTimeout(() => {
    done()
  }, 2000)
}

const waitWithAsync = async (element: WElement, done: () => void) => {
  console.log('waitWithAsync')
  await pause()
  done()
}

const nowait = (element: WElement) => {
  console.log('nowait')
  return element
}

const getStyle = (element: WElement, style: string) => {
  style = element.style.all
  return element
}

const logger = (el: WElement) => {
  console.log('logger')
  return el
}

btn.on('click', function (this: WElement, event) {
  let style = ''

  for (var i = 0, l = btn.style.length; i < l; i++) {
    // console.log(btn.style[i]) // an active inline-style
  }

  console.log('event', typeof event)
  this.hide()
    .pipe(nowait)
    .pipe(el => {
      for (var i = 0, l = el.style.length; i < l; i++) {
        // console.log( el.style[i]) // an active inline-style
      }
      style = el.style[0]
      return el
    })
    .pipeAsync(waitWithAsync)
    .then(() => this.pipe(logger))
    .then(() => this.pipeAsync(waitWithPromise))
    .then(() => this.pipeAsync(waitWithAsync))
    .then(() => {
      // console.log('STYLE', style, typeof style)
    })
    .then(() => {
      console.log('show')
      this.show()
    })
})
