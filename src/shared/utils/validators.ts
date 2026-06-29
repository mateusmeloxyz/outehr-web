export function required(value: unknown): boolean | string {
  if (value === null || value === undefined || value === '') return 'This field is required'
  if (typeof value === 'string' && value.trim() === '') return 'This field is required'
  return true
}

export function maxLength(max: number) {
  return (value: string): boolean | string => {
    if (!value) return true
    if (value.length > max) return `Max ${max} characters`
    return true
  }
}

export function validEmail(value: string): boolean | string {
  if (!value) return true
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(value)) return 'Invalid email format'
  return true
}

export function validPhone(value: string): boolean | string {
  if (!value) return true
  const re = /^[\d\s\-()+.]{7,20}$/
  if (!re.test(value)) return 'Invalid phone format'
  return true
}

export function minValue(min: number) {
  return (value: number): boolean | string => {
    if (value === null || value === undefined) return true
    if (value < min) return `Must be at least ${min}`
    return true
  }
}

export function range(min: number, max: number) {
  return (value: number): boolean | string => {
    if (value === null || value === undefined) return true
    if (value < min || value > max) return `Must be between ${min} and ${max}`
    return true
  }
}
