import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Report, Student, ReportGenerationRequest } from '@/types'

// Mock data for demo
const mockStudents: Student[] = [
  { id: '1', name: 'Emma Johnson', grade: '5th Grade', email: 'emma.j@school.edu', createdAt: '2024-01-15' },
  { id: '2', name: 'Liam Williams', grade: '5th Grade', email: 'liam.w@school.edu', createdAt: '2024-01-15' },
  { id: '3', name: 'Olivia Brown', grade: '4th Grade', email: 'olivia.b@school.edu', createdAt: '2024-01-16' },
  { id: '4', name: 'Noah Davis', grade: '5th Grade', email: 'noah.d@school.edu', createdAt: '2024-01-16' },
  { id: '5', name: 'Ava Martinez', grade: '4th Grade', email: 'ava.m@school.edu', createdAt: '2024-01-17' },
]

const mockReports: Report[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Emma Johnson',
    title: 'Q1 Progress Report',
    content: `Emma has demonstrated exceptional growth this quarter. Her reading comprehension has improved significantly, moving from a 3rd grade level to solidly within 5th grade expectations.\n\n**Academic Highlights:**\n- Consistently completes homework assignments on time\n- Shows strong analytical thinking in math problem-solving\n- Actively participates in class discussions\n\n**Areas for Continued Growth:**\n- Working on organizing written responses\n- Building confidence in presenting to larger groups\n\nEmma is a pleasure to have in class and continues to be a positive influence on her peers.`,
    status: 'sent',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Liam Williams',
    title: 'Q1 Progress Report',
    content: `Liam has shown remarkable improvement in his academic performance this quarter.\n\n**Academic Highlights:**\n- Strong aptitude for mathematical concepts\n- Excellent collaborative skills in group projects\n- Creative approach to problem-solving\n\n**Areas for Continued Growth:**\n- Focusing on attention to detail in written work\n- Time management during independent work periods`,
    status: 'reviewed',
    createdAt: '2024-01-21',
    updatedAt: '2024-01-21'
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Olivia Brown',
    title: 'Behavioral Assessment',
    content: `Olivia continues to be a model student in terms of classroom behavior and engagement.`,
    status: 'draft',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  }
]

// AI-generated report templates for spoofing
const reportTemplates = {
  progress: [
    `{name} has demonstrated consistent growth throughout this reporting period. Their engagement in classroom activities has been commendable.

**Academic Performance:**
- Shows strong comprehension of core curriculum concepts
- Actively participates in group discussions and collaborative work
- Demonstrates improving organizational skills in managing assignments

**Social Development:**
- Works well with peers in group settings
- Shows respect for classroom rules and expectations
- Demonstrates empathy and kindness toward classmates

**Areas for Growth:**
- Continue building confidence in sharing ideas with the whole class
- Focus on showing all work in mathematical problem-solving

{name} is making excellent progress and we look forward to seeing continued growth.`,

    `This quarter, {name} has shown remarkable dedication to their academic growth. Their commitment to learning is evident in their daily work.

**Strengths Observed:**
- Exceptional attention to detail in written assignments
- Strong problem-solving abilities across subjects
- Enthusiastic participation in hands-on learning activities

**Progress Highlights:**
- Reading fluency has improved significantly
- Mathematical reasoning skills continue to develop
- Science inquiry skills are emerging nicely

**Next Steps:**
- Continue challenging {name} with extension activities
- Support development in presenting ideas orally

We are proud of {name}'s accomplishments this quarter.`
  ],
  behavioral: [
    `{name} consistently demonstrates positive behaviors that contribute to a supportive classroom environment.

**Behavioral Strengths:**
- Follows classroom expectations independently
- Shows self-regulation skills during transitions
- Demonstrates respect for peers and adults
- Takes responsibility for personal belongings and workspace

**Social-Emotional Growth:**
- Building positive relationships with classmates
- Shows resilience when facing challenges
- Developing conflict resolution skills

**Recommendations:**
- Continue reinforcing positive choices
- Encourage leadership opportunities

{name} is a valued member of our classroom community.`
  ],
  academic: [
    `{name}'s academic performance this period reflects dedicated effort and growing mastery of grade-level standards.

**Reading & Language Arts:**
- Demonstrates grade-level reading comprehension
- Writing shows improving organization and detail
- Vocabulary usage continues to expand

**Mathematics:**
- Shows solid understanding of core concepts
- Problem-solving strategies are developing well
- Fact fluency continues to improve

**Science & Social Studies:**
- Engages enthusiastically with content
- Makes connections across subject areas
- Demonstrates curiosity through questioning

{name} is meeting academic expectations and shows potential for continued growth.`
  ],
  iep: [
    `Progress Report for {name}'s Individualized Education Program Goals:

**Goal 1: Reading Comprehension**
Current Progress: Making steady progress toward annual goal
- Demonstrates improved ability to identify main ideas
- Working on making inferences from text
- Support strategies are effective

**Goal 2: Written Expression**
Current Progress: Approaching benchmark
- Sentence structure has improved
- Working on paragraph organization
- Benefits from graphic organizers

**Goal 3: Social Skills**
Current Progress: Meeting expectations
- Improved peer interactions observed
- Self-advocacy skills developing
- Continues to benefit from social skills instruction

**Recommendations:**
- Continue current accommodations and modifications
- Schedule team meeting to discuss transition planning

{name} continues to make meaningful progress toward IEP goals.`
  ]
}

export const useReportsStore = defineStore('reports', () => {
  const students = ref<Student[]>(mockStudents)
  const reports = ref<Report[]>(mockReports)
  const generating = ref(false)

  const recentReports = computed(() =>
    [...reports.value]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  )

  const reportsByStatus = computed(() => ({
    draft: reports.value.filter(r => r.status === 'draft').length,
    generated: reports.value.filter(r => r.status === 'generated').length,
    reviewed: reports.value.filter(r => r.status === 'reviewed').length,
    sent: reports.value.filter(r => r.status === 'sent').length,
  }))

  function getStudent(id: string) {
    return students.value.find(s => s.id === id)
  }

  function getReport(id: string) {
    return reports.value.find(r => r.id === id)
  }

  async function generateReport(request: ReportGenerationRequest): Promise<Report> {
    generating.value = true

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))

    const student = getStudent(request.studentId)
    if (!student) throw new Error('Student not found')

    // Get random template for the report type
    const templates = reportTemplates[request.reportType] || reportTemplates.progress
    const template = templates[Math.floor(Math.random() * templates.length)]

    // Replace placeholders
    let content = template.replace(/{name}/g, student.name.split(' ')[0])

    // Add custom notes if provided
    if (request.notes) {
      content += `\n\n**Additional Notes:**\n${request.notes}`
    }

    // Add strengths if provided
    if (request.strengths?.length) {
      content = content.replace('**Strengths Observed:**', `**Strengths Observed:**\n${request.strengths.map(s => `- ${s}`).join('\n')}`)
    }

    const newReport: Report = {
      id: String(reports.value.length + 1),
      studentId: request.studentId,
      studentName: student.name,
      title: `${request.period} ${request.reportType.charAt(0).toUpperCase() + request.reportType.slice(1)} Report`,
      content,
      status: 'generated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    reports.value.push(newReport)
    generating.value = false

    return newReport
  }

  function updateReport(id: string, updates: Partial<Report>) {
    const index = reports.value.findIndex(r => r.id === id)
    if (index !== -1) {
      reports.value[index] = {
        ...reports.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  function deleteReport(id: string) {
    reports.value = reports.value.filter(r => r.id !== id)
  }

  function addStudent(student: Omit<Student, 'id' | 'createdAt'>) {
    const newStudent: Student = {
      ...student,
      id: String(students.value.length + 1),
      createdAt: new Date().toISOString()
    }
    students.value.push(newStudent)
    return newStudent
  }

  return {
    students,
    reports,
    generating,
    recentReports,
    reportsByStatus,
    getStudent,
    getReport,
    generateReport,
    updateReport,
    deleteReport,
    addStudent
  }
})
