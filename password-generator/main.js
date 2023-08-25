const characters = []

for (let code = 'a'.charCodeAt(0); code <= 'z'.charCodeAt(0); code++) {
  characters.push(String.fromCharCode(code))
}

for (let code = 'A'.charCodeAt(0); code <= 'Z'.charCodeAt(0); code++) {
  characters.push(String.fromCharCode(code))
}

for (let code = '1'.charCodeAt(0); code <= '9'.charCodeAt(0); code++) {
  characters.push(String.fromCharCode(code))
}

const password = generatePassword(8)
const div = document.createElement('div')
div.textContent = password
document.body.appendChild(div)

function generatePassword(length) {
  let password = ''
  for (let i = 1; i <= length; i++) {
    password += generateRandomCharacter(characters)
  }
  return password
}

function generateRandomCharacter(characters) {
  return characters[generateRandomInteger(0, characters.length - 1)]
}

function generateRandomInteger(from, to) {
  return Math.floor(from + (to + 1 - from) * Math.random())
}
