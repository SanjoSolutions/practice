let i = 0
repeat(() => {
  console.log('hi')
  i++
}).until(() => i === 3)

function repeat(fn) {
  return {
    until(condition) {
      do {
        fn()
      } while (!condition())
    }
  }
}
