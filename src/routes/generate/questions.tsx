import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/generate/questions')({
  component: Questions,
})

function Questions() {
  return <div>Hello "/generate/questions"!</div>
}
