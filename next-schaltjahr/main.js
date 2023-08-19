function findNextSchaltjahr() {
  const currentYear = new Date().getFullYear()
  let year = currentYear
  while (!isSchaltjahr(year)) {
    year++
  }
  return year
}

function isSchaltjahr(year) {
  if (year % 4 === 0) {
    if (year % 100 === 0) {
      if (year % 400 === 0) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }
  return false
}

console.log(findNextSchaltjahr())
