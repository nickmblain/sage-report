export interface Student {
  id: string
  name: string
  grade: string
  email?: string
  createdAt: string
}

export interface Report {
  id: string
  studentId: string
  studentName: string
  title: string
  content: string
  status: 'draft' | 'generated' | 'reviewed' | 'sent'
  createdAt: string
  updatedAt: string
}

export interface ReportGenerationRequest {
  studentId: string
  reportType: 'progress' | 'behavioral' | 'academic' | 'iep'
  period: string
  notes?: string
  strengths?: string[]
  areasForGrowth?: string[]
}
