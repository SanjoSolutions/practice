import Decimal from './libs/decimal.mjs'

export function sum(values) {
  return values.reduce(add, new Decimal(0))
}

function add(a, b) {
  return Decimal.add(a, b)
}
