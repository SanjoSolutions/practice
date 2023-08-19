let birthDate = prompt('If you enter a birth date, I can calculate the age.')
const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(birthDate)
birthDate = new Date(`${match[3]}-${match[2]}-${match[1]}`)

const now = new Date()
let age = now.getFullYear() - birthDate.getFullYear()
if (now.getMonth() < birthDate.getMonth() || (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())) {
  age--
}

alert(`Your age seems to be ${age}.`)
