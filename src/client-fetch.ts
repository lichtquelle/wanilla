/**
 * @author    Yannick Deubel (https://github.com/yandeu)
 * @copyright Copyright (c) 2021 Yannick Deubel
 * @license   {@link https://github.com/lichtquelle/wanilla/blob/main/LICENSE LICENSE}
 */

/**
 * Simple GET request wrapper around Fetch API
 * Reject will return statusCode and statusMessage { code: number, message: string }
 */
export const clientFetch = (url: string, options?: RequestInit): Promise<Response> => {
  const isRelativeURL = !/^https?:\/\//.test(url)

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(res => {
        const code = res.status
        const message = res.statusText
        const location = res.headers.get('location')

        if (!code) return reject({ code, message })

        if (code >= 400) return reject({ code, message })

        if (code >= 300 && typeof location !== 'string')
          return reject({ code, message: 'location not found in headers' })

        if (code >= 300 && typeof location === 'string') {
          if (isRelativeURL) clientFetch(location, options).then(resolve, reject)
          else clientFetch(new URL(location, url).href, options).then(resolve, reject)
        }

        if (code < 300) return resolve(res)
      })
      .catch(error => reject({ code: 500, message: error.message }))
  })
}
