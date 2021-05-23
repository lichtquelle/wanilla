/**
 * @author    Yannick Deubel (https://github.com/yandeu)
 * @copyright Copyright (c) 2021 Yannick Deubel
 * @license   {@link https://github.com/lichtquelle/wanilla/blob/main/LICENSE LICENSE}
 */

import type { WElement, WElementArray } from './types'
import { isEvent } from './misc'

class Wanilla {
  get add() {
    return {
      style: (url: string, props: any = {}) => {
        return W('link', { ...props, rel: 'stylesheet', href: url })
      },
      script: (url: string, props: any = {}) => {
        return W('script', { ...props, src: url })
      }
    }
  }

  create(tag: string, props: any = null, children: any[]): WElement {
    // https://github.com/nanojsx/nano/blob/master/src/core.ts#L227
    const el = tag === 'svg' ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag)

    let ref

    // https://github.com/nanojsx/nano/blob/master/src/core.ts#L244
    for (const p in props) {
      // style object to style string
      if (p === 'style' && typeof props[p] === 'object') {
        const styles = Object.keys(props[p])
          .map(k => `${k}:${props[p][k]}`)
          .join(';')
          .replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
        props[p] = `${styles};`
      }

      // handel ref
      if (p === 'ref') ref = props[p]
      // handle events
      else if (isEvent(el, p.toLowerCase())) el.addEventListener(p.toLowerCase().substring(2), (e: any) => props[p](e))
      else if (/className/i.test(p)) console.warn('You can use "class" instead of "className".')
      else el.setAttribute(p, props[p])
    }

    children.forEach((child: any) => {
      el.append(child)
    })

    const fEl = this.get(el as HTMLElement)
    if (ref) ref(fEl)

    return fEl
  }

  get(tag: string | HTMLElement | WElement): WElement {
    let el: WElement

    if (typeof tag === 'string') {
      el = document.querySelector(tag) as WElement
    } else {
      el = tag as WElement
    }

    // @ts-ignore
    if (!el) return

    // already is an WElement
    if (el._isFElement) return el
    el._isFElement = true

    if (typeof tag === 'string') el._selector = tag

    el.get = {
      firstChild: () => W(el.firstElementChild),
      nextSibling: () => W(el.nextSibling)
    }

    el.set = {
      HTML: (html: string) => {
        el.innerHTML = html
        return el
      },
      id: (id: string) => {
        el.id = id
        return el
      }
    }

    el.class = {
      get: () => el.classList.value.split(' '),
      set: (...name: string[]) => {
        el.classList.add(...name)
        return el
      },
      add: (...name: string[]) => el.class.set(...name),
      remove: (...name: string[]) => {
        el.classList.remove(...name)
        return el
      },
      toggle: (name: string, force?: boolean) => {
        el.classList.toggle(name, force)
        return el
      }
    }

    el.css = {
      get: (property: string) => el.style.getPropertyValue(property),
      set: (property: string, value: string) => {
        const _value = el.style[property as any]

        if (_value === undefined) {
          console.warn(`CSS property "${property}" is not valid!`)
          return el
        }

        el.style[property as any] = value
        return el
      },
      add: (property: string, value: string) => el.css.set(property, value),
      remove: (property: string) => {
        el.style.removeProperty(property)
        return el
      },
      toggle: (property: string, value: string) => {
        const _value = el.style[property as any]

        if (_value === undefined) {
          console.warn(`CSS property "${property}" is not valid!`)
          return el
        }

        if (_value === '') el.style[property as any] = value
        else el.style[property as any] = ''

        return el
      }
    }

    el.appendTo = (tag: string | HTMLElement): WElement => {
      this.get(tag).appendChild(el)
      return el
    }

    el.all = (selector: string = '*'): WElementArray => {
      return this.getAll(selector, el)
    }

    el.on = (event: string, listener: EventListenerOrEventListenerObject) => {
      el.addEventListener(event, listener, false)
      return el
    }

    el.hide = () => {
      el.hidden = true
      return el
    }

    el.show = () => {
      el.hidden = false
      return el
    }

    el.pipeAsync = (fnc: (element: WElement, done: () => void) => void): Promise<WElement> => {
      return new Promise(resolve => {
        fnc(el, () => {
          resolve(el)
        })
      })
    }

    el.pipe = (fnc: (element: WElement) => WElement): WElement => fnc(el)

    el.tick = new Promise(resolve => resolve(el))

    return el
  }

  getAll(tag: string = '*', doc: HTMLElement | Document | WElement = document): WElementArray {
    const els = doc.querySelectorAll(tag) as WElementArray

    els.item = (index: number): WElement => {
      return this.get(els[index])
    }

    els.each = (fn: (element: WElement, index?: number, parent?: WElementArray) => void) => {
      for (let i = 0, len = els.length; i < len; ++i) {
        fn(this.get(els[i] as WElement), i, els)
      }
      return els as WElementArray
    }

    els.tick = new Promise(resolve => resolve(els))

    return els as WElementArray
  }
}

const wanilla = new Wanilla()
const parser = new DOMParser()

function evalInContext(js: string, context: any = null) {
  //# Return the results of the in-line anonymous function we .call with the passed context
  return function () {
    return eval(js)
  }.call(context)
}

// fetch all includes
const autoInclude = async (level = 0) => {
  // max level of nesting
  const MAX_LEVEL = 5
  if (level >= MAX_LEVEL) return

  const promises: Promise<void>[] = []

  W.all().forEach(inc => {
    if (/^INCLUDE-\D+$/.test(inc.tagName)) {
      const placeholder = inc.tagName.toLowerCase()
      const file = inc.getAttribute('src')
      let props = {}

      // get file from "src"
      if (!file) return console.warn(`Attribute "src" missing in "<${placeholder}></${placeholder}>".`)

      // get all props
      for (let i = 0; i < inc.attributes.length; i++) {
        const { name, value } = inc.attributes[i]
        if (name !== 'src') props = { ...props, [name]: value }
      }

      // include the file
      promises.push(include(placeholder.replace('include-', ''), file, props))
    }
  })

  if (promises.length > 0) {
    // fetch all visible <include> elements
    await Promise.all(promises)
    // fetch again, maybe there are now more <include> elements on the DOM
    autoInclude(level + 1)
  }
}

const include = async (
  placeholder: WElement | HTMLElement | string,
  file: string,
  props: { [key: string]: string } = {}
) => {
  const p = typeof placeholder === 'string' ? W(`include-${placeholder}`) : placeholder
  if (!p) return console.warn(`Include tag "<include-${placeholder}></include-${placeholder}>" not found.`)

  const pathname = new URL(file, 'http://localhost').pathname
  const isCSS = /\.css$/.test(pathname)
  const isJS = /\.js$/.test(pathname)

  if (isCSS || isJS) {
    // remove placeholder
    p.remove()

    // add style/script to head
    if (isCSS) W.add.style(file, props).appendTo(W('head'))
    else W.add.script(file, props).appendTo(W('head'))

    return
  }

  // fetch the file
  const res = await fetch(file) // clientFetch(file).catch(error => console.warn(file, { code: 500, message: error.message }))

  if (res && res.status === 200) {
    let text = await res.text()

    // replace props in text
    for (const [key, value] of Object.entries(props)) {
      text = text.replace(new RegExp(`{${key.toUpperCase()}}`), value)
    }

    // parse to html
    const html = parser.parseFromString(text, 'text/html')

    let lastNode = p

    for (let i = 0; i < html.body.childNodes.length; i++) {
      const child = html.body.childNodes[i] as HTMLElement

      // skip TextNodes
      if (child.nodeType === 3) continue

      // execute inline scripts
      if (child.nodeName === 'SCRIPT') {
        evalInContext(child.innerText)
      }
      // add fragments to DOM
      else {
        lastNode.after(child)
        lastNode = child
      }
    }

    // remove placeholder
    p.remove()
  } else {
    // error message
    const err = `File "${file}" not found.`

    // log the error
    console.warn(err)

    // append span with error message
    p.after(W('span', { style: { color: 'red' } }, err))

    // remove placeholder
    p.remove()

    return
  }
}

const W = Object.assign(
  (tag: string | HTMLElement | ChildNode | WElement | null, props?: any, ...children: any[]) => {
    if (typeof tag === 'string' && (props || props === null || children.length > 0))
      return wanilla.create(tag, props, children)
    else return wanilla.get(tag as HTMLElement)
  },
  {
    autoInclude: autoInclude,
    include: include,
    all: wanilla.getAll.bind(wanilla),
    add: wanilla.add
  }
)

export default W
