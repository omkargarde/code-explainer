import CodeEntry from '@/components/CodeEntry'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/code')({
  component: Code,
})

function Code() {
  return <CodeEntry />
}
