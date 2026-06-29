export interface Specialty {
  id: number
  name: string
  description: string | null
  defaultSlotDurationMinutes: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SpecialtyFormData {
  name: string
  description: string | null
  defaultSlotDurationMinutes: number
}
