export function formatCurrency(value) {
  const number = (
    value.decimalPlaces === 0 ? value.toString() : value.toFixed(2)
  ).replace('.', ',')
  return number + ' €'
}
