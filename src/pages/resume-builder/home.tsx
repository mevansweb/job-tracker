import { ResumeProvider } from '@/components/providers/resume-provider'
import ResumeBuilder from '@/pages/resume-builder/builder'

export default function ResumeHome() {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  )
}
