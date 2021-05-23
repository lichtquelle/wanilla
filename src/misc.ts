/**
 * @author    Yannick Deubel (https://github.com/yandeu)
 * @copyright Copyright (c) 2021 Yannick Deubel
 * @license   {@link https://github.com/lichtquelle/wanilla/blob/main/LICENSE LICENSE}
 */

// https://github.com/nanojsx/nano/blob/master/src/core.ts#L232
// check if the element includes the event (for example 'oninput')
export const isEvent = (el: HTMLElement | any, p: string) => {
  // check if the event begins with 'on'
  if (0 !== p.indexOf('on')) return false

  // check if the event is present in the element as object (null) or as function
  return typeof el[p] === 'object' || typeof el[p] === 'function'
}
