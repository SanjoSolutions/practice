const state = new Array(3 * 3)

window.move = move

printState()


function move(row, column) {
  state[(row - 1) * 3 + (column - 1)] = 'X'

  printState()

  letComputerMove()

  printState()
}

function printState() {
  console.log(`${retrieveCellFormatted(1, 1)}|${retrieveCellFormatted(1, 2)}|${retrieveCellFormatted(1, 3)}`)
  console.log(`${retrieveCellFormatted(2, 1)}|${retrieveCellFormatted(2, 2)}|${retrieveCellFormatted(2, 3)}`)
  console.log(`${retrieveCellFormatted(3, 1)}|${retrieveCellFormatted(3, 2)}|${retrieveCellFormatted(3, 3)}`)
  console.log('')
}

function retrieveCell(row, column) {
  return state[(row - 1) * 3 + (column - 1)]
}

function retrieveCellFormatted(row, column) {
  const value = retrieveCell(row, column)
  return value || ' '
}

function letComputerMove() {
  if (isX(1, 1) && isX(1, 2) && isFree(1, 3)) {
    moveAsComputer(1, 3)
  } else if (isX(2, 1) && isX(2, 2) && isFree(2, 3)) {
    moveAsComputer(2, 3)
  } else if (isX(3, 1) && isX(3, 2) && isFree(3, 3)) {
    moveAsComputer(3, 3)
  } else if (isX(1, 1) && isX(2, 1) && isFree(3, 1)) {
    moveAsComputer(3, 1)
  } else if (isX(1, 2) && isX(2, 2) && isFree(3, 2)) {
    moveAsComputer(3, 2)
  } else if (isX(1, 3) && isX(2, 3) && isFree(3, 3)) {
    moveAsComputer(3, 3)
  }

  const position = findMove()
  moveAsComputer(position.row, position.column)
}

function findMove() {
  return findInRows() || findInColumns() || findInVerticals() || findBestFreePosition()
}

function findInRows() {
  return findInRow(1) || findInRow(2) || findInRow(3)
}

function findInColumns() {
  return findInColumn(1) || findInColumn(2) || findInColumn(3)
}

function findInVerticals() {
  return findInVerticalFromTopLeftToBottomRight() || findInVerticalFromTopRightToBottomLeft()
}

function findInRow(row) {
  if (isX(row, 1) && isX(row, 2) && isFree(row, 3)) {
    return {row, column: 3}
  } else if (isX(row, 1) && isFree(row, 2) && isX(row, 3)) {
    return {row, column: 2}
  } else if (isFree(row, 1) && isX(row, 2) && isX(row, 3)) {
    return {row, column: 1}
  }
}

function findInColumn(column) {
  if (isX(1, column) && isX(2, column) && isFree(3, column)) {
    return {row: 3, column}
  } else if (isX(1, column) && isFree(2, column) && isX(3, column)) {
    return {row: 2, column}
  } else if (isFree(1, 1) && isX(2, 2) && isX(3, 3)) {
    return {row: 1, column}
  }
}

function findInVerticalFromTopLeftToBottomRight() {
  if (isX(1, 1) && isX(2, 2) && isFree(3, 3)) {
    return {row: 3, column: 3}
  } else if (isX(1, 1) && isFree(2, 2) && isX(3, 3)) {
    return {row: 2, column: 2}
  } else if (isFree(1, 1) && isX(2, 2) && isX(3, 3)) {
    return {row: 1, column: 1}
  }
}

function findInVerticalFromTopRightToBottomLeft() {
  if (isX(1, 3) && isX(2, 2) && isFree(3, 1)) {
    return {row: 3, column: 1}
  } else if (isX(1, 3) && isFree(2, 2) && isX(3, 1)) {
    return {row: 2, column: 2}
  } else if (isFree(1, 3) && isX(2, 2) && isX(3, 1)) {
    return {row: 1, column: 3}
  }
}

function findBestFreePosition() {
  return returnIfFree(2, 2) || returnIfFree(1, 1) || returnIfFree(1, 3) || returnIfFree(3, 1) || returnIfFree(3, 3) || returnIfFree(1, 2) || returnIfFree(2, 3) || returnIfFree(3, 2) || returnIfFree(2, 1)
}

function returnIfFree(row, column) {
  return isFree(row, column) ? {row, column} : null
}

function isX(row, column) {
  return retrieveCell(row, column) === 'X'
}

function isFree(row, column) {
  return !retrieveCell(row, column)
}

function moveAsComputer(row, column) {
  state[(row - 1) * 3 + (column - 1)] = 'O'
}
