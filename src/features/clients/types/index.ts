export interface Client {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  dateOfBirth: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ClientFormData {
  firstName: string
  lastName: string
  email: string
  phone: string | null
  dateOfBirth: string | null
}
