import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/generate/questions")({
  component: Questions,
});

const generateQuestionFn = createServerFn({ method: "GET" }).handler(() => {});

function Questions() {
  return <div>Hello "/generate/questions"!</div>;
}
