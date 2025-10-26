import { createFileRoute } from '@tanstack/react-router'
import CodeEntry from '@/components/CodeEntry'

export const Route = createFileRoute('/code')({
  component: Code,
})

function Code() {
  return <CodeEntry />
}
