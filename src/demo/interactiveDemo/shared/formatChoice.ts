export function formatMayor(choice: string) {
  return `[${splitChoices(choice)
    .map((c) => `'${c}'`)
    .join(', ')}]`
}

export function joinChoices(choices: string[]) {
  return [...choices].sort().join(', ')
}

export function splitChoices(choice: string) {
  return choice.split(', ').filter(Boolean)
}
