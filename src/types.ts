export interface WElementArray extends NodeListOf<WElement> {
  _isFElement: boolean
  each: (
    fn: (element: WElement, index?: number | undefined, parent?: WElementArray | undefined) => void
  ) => WElementArray
  tick: Promise<WElementArray>
}

export interface WBase {
  _isFElement: boolean
  _selector: string
  get: {
    /** Return the first child element (firstElementChild) */
    firstChild: () => WElement
    nextSibling: () => WElement
  }
  set: {
    HTML: (html: string) => WElement
    id: (id: string) => WElement
  }
  class: {
    get: () => string[]
    set: (...name: string[]) => WElement
    /** Alias for set() */
    add: (...name: string[]) => WElement
    remove: (...name: string[]) => WElement
    /** If force is not given, "toggles" token, removing it if it's present and adding it if it's not present. If force is true, adds token (same as add()). If force is false, removes token (same as remove()). */
    toggle: (name: string, force?: boolean) => WElement
  }
  css: {
    get: (property: string) => string | undefined
    set: (property: string, value: string) => WElement
    /** Alias for set() */
    add: (property: string, value: string) => WElement
    remove: (property: string) => WElement
    toggle: (property: string, value: string) => WElement
  }
  all: (selector: string) => WElementArray
  appendTo: (tag: string | HTMLElement) => WElement
  on: (event: string, listener: EventListenerOrEventListenerObject) => WElement
  hide: () => WElement
  show: () => WElement
  pipe: (fnc: (element: WElement, ...args: any) => WElement) => WElement
  pipeAsync: (fnc: (element: WElement, done: () => void, ...args: any) => void) => Promise<WElement>
  tick: Promise<WElement>
}

export interface WElement extends WBase, HTMLElement {}
export interface WInputElement extends WBase, HTMLInputElement {}
// add more if needed
