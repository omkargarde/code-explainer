import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send } from "lucide-react";
import type { UIMessage } from "ai";
import { GradientHeading } from "@/components/GradientHeading";
import { QuestionCard } from "@/components/QuestionCard";
import { PROMPTS } from "@/constants/constants";

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
    <div className="absolute right-0 bottom-0 left-64 border-t border-orange-500/10 bg-gray-900/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-3xl px-4 py-3">{children}</div>
    </div>
  );
}

function Messages({ messages }: { messages: Array<UIMessage> }) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages.length) {
    return null;
  }

  return (
    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto pb-24">
      <div className="mx-auto w-full max-w-3xl px-4">
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
                {parts.map((part) => {
                  if (part.type === "text") {
                    // Try to parse as JSON first
                    try {
                      const jsonData = JSON.parse(part.text);
                      if (Array.isArray(jsonData) && jsonData.length > 0) {
                        const question = jsonData[0];
                        return <QuestionCard question={question} />;
                      }
                    } catch {
                      // Not JSON, display as regular text
                      return <div className="flex-1">{part.text}</div>;
                    }
                  }
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

  return (
    <div className="relative flex h-[calc(100vh-32px)] bg-gray-900">
      <div className="flex flex-1 flex-col">
        <Messages messages={messages} />

        <Layout>
          <div className="mx-auto flex max-w-xl space-x-3">
            <button
              type="submit"
              className="btn btn-primary flex items-center p-2"
              onClick={() =>
                sendMessage({ text: PROMPTS.user_prompt.new_question })
              }
            >
              <span className="pr-4 text-white">Generate questions </span>
              <Send className="h-4 w-4 text-orange-500 transition-colors hover:text-orange-400" />
            </button>
          </div>
        </Layout>
      </div>
    </div>
  );
}
