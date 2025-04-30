import { mapKeys, mapValues } from '../../../../../src/utils'

export function commafy(email: string) {
  return email.replace(/\./g, ',')
}

function decommafy(key: string) {
  return key.replace(/,/g, '.')
}

function is_commafy_field(fieldName: string) {
  return fieldName.endsWith('_for') || fieldName.endsWith('_from') || fieldName === 'verified'
}

export function transform_email_keys(data: Record<string, object>, direction: 'commafy' | 'decommafy') {
  // Which direction are we transforming?
  const transform = direction === 'decommafy' ? decommafy : commafy

  // Go through all fields
  return mapValues(data, (field, fieldName) => {
    // Only modify our whitelisted `is_commafy_field`s
    if (!is_commafy_field(fieldName)) {
      return field
    }
    return mapKeys(field as Record<string, string>, (_, key) => transform(key))
  })
}
