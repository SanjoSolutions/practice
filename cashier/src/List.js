import "./List.css"
import { formatCurrency } from "./formatCurrency.js"
import { sum } from "./sum.js"

export function List({ items }) {
  return (
    <div className="list">
      <h2>Groceries</h2>
      <ul>
        { items.map((item, index) =>
          <li key={ index }>{ item.name } for { formatCurrency(item.price) }</li>) }
      </ul>
      <div className="total">
        <strong>Total:</strong> { formatCurrency(calculateTotal(items)) }
      </div>
    </div>
  )
}

function calculateTotal(items) {
  return sum(items.map(({ price }) => price))
}
