export interface Clinic {
  id: number
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string | null
  email: string | null
  latitude: number | null
  longitude: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ClinicFormData {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string | null
  email: string | null
  latitude: number | null
  longitude: number | null
}
