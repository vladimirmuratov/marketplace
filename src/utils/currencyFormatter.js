export function currencyFormatter (value) {
  return new Intl.NumberFormat('us-US', {
    currency: 'USD',
    style: 'currency'
  }).format(value)
}
