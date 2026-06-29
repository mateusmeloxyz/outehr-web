export interface Provider {
  id: number
  userId: number | null
  specialtyId: number
  clinicId: number
  firstName: string
  lastName: string
  npi: string | null
  phone: string | null
  email: string | null
  rating: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProviderFormData {
  specialtyId: number
  clinicId: number
  firstName: string
  lastName: string
  npi: string | null
  phone: string | null
  email: string | null
}
