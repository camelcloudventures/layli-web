import type { InspectionQuestion } from "@/lib/types/inspection-types"

export function calculateScore(questions: InspectionQuestion[]): number {
  if (!questions || questions.length === 0) return 0

  let totalQuestions = 0
  let passedQuestions = 0

  questions.forEach((question) => {
    if (question.response !== null) {
      totalQuestions++
      if (question.response === true) {
        passedQuestions++
      }
    }
  })

  return totalQuestions > 0 ? Math.round((passedQuestions / totalQuestions) * 100) : 0
}
