import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { GradientHeading } from "@/components/GradientHeading";
import { QuestionCard } from "@/components/QuestionCard";
import { PROMPTS } from "@/constants/constants";
import { AudioRecorder } from "@/components/AudioRecorder";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

function InitialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="mx-auto w-full max-w-3xl text-center">
        <GradientHeading className="mb-4 text-6xl">
          Mock <span className="text-white">Interviewer</span>
        </GradientHeading>
        {children}
      </div>
    </div>
  );
}

function ChattingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed right-0 bottom-0 left-0 w-full border-t border-orange-500/10 bg-gray-900/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-3xl px-4 py-3">{children}</div>
    </div>
  );
}
// todo:
function Messages({ messages }: { messages: Array<UIMessage> }) {
  // auto scrolls to the bottom when new message is generated
  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  if (!messages.length) {
    return null;
  }

  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-4 pb-20">
        {messages.map(({ id, role, parts }) => (
          <div key={id} className="bg-transparent p-4">
            <div className="mx-auto flex w-full max-w-3xl items-start gap-4">
              {role === "assistant" ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-r from-orange-500 to-red-600 text-sm font-medium text-white">
                  AI
                </div>
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-700 text-sm font-medium text-white">
                  YOU
                </div>
              )}
              <div className="flex-1">
                {parts.map((part, index) => {
                  if (part.type === "text") {
                    try {
                      const jsonData = JSON.parse(part.text);
                      if (Array.isArray(jsonData) && jsonData.length > 0) {
                        return (
                          <QuestionCard key={index} question={jsonData[0]} />
                        );
                      }
                    } catch {
                      // Not JSON, fall through to render as text
                    }
                    // Fallback for non-JSON or invalid structured JSON
                    return (
                      <div key={index} className="flex-1">
                        {part.text}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function ChatPage() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate-questions",
    }),
  });

  const Layout = messages.length ? ChattingLayout : InitialLayout;
  const [isQuestionOrFeedback, setIsQuestionOrFeedback] = useState<
    "question" | "feedback"
  >("question");

  return (
    <div className="relative flex min-h-screen bg-gray-900">
      <div className="flex flex-1 flex-col">
        <Messages messages={messages} />

        <Layout>
          <div className="mx-auto flex max-w-xl space-x-3">
            {isQuestionOrFeedback === "question" && (
              <button
                type="submit"
                className="btn btn-primary flex items-center p-2"
                onClick={() => {
                  setIsQuestionOrFeedback("feedback");
                  sendMessage({ text: PROMPTS.user_prompt.new_question });
                }}
              >
                Generate questions
              </button>
            )}
            {isQuestionOrFeedback === "feedback" && <AudioRecorder />}
          </div>
        </Layout>
      </div>
    </div>
  );
}
