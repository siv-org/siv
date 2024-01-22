export function getOrdinal(n: number): string {
  const lastTwoDigits = n % 100

  // Handle the exceptions 11, 12, & 13
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return n + 'th'

  const lastDigit = n % 10
  switch (lastDigit) {
    case 1:
      return n + 'st'
    case 2:
      return n + 'nd'
    case 3:
      return n + 'rd'
    default:
      return n + 'th'
  }
}

// console.log(getOrdinal(3)) // Output: "3rd"
// console.log(getOrdinal(22)) // Output: "22nd"
// console.log(getOrdinal(15)) // Output: "15th"
// console.log(getOrdinal(11)) // Output: "11th"
// console.log(getOrdinal(1)) // Output: "1st"
