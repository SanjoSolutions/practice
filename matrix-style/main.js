const numberOfRows = 10
const numberOfColumns = 10

function generateContent() {
  let content = ''

  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      content += generateRandomCharacter()
    }
    content += '<br>'
  }

  return content
}

function generateRandomCharacter() {
  return String.fromCharCode(generateRandomInteger('A'.charCodeAt(0), 'Z'.charCodeAt(0)))
}

function generateRandomInteger(from, to) {
  return Math.floor(from + (to + 1 - from) * Math.random())
}

const content = generateContent()
document.body.innerHTML = content

setInterval(function () {
  const content = generateContent()
  document.body.innerHTML = content
}, 1000)
