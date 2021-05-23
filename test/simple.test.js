const W = require('../lib/index').default

test('should append H1 to DOM', () => {
  const h1 = W('h1', null, 'Hello World!')
  W('body').append(h1)

  expect(document.body.innerHTML).toBe('<h1>Hello World!</h1>')
})
