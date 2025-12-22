import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send } from "lucide-react";
import type { UIMessage } from "ai";
import { GradientHeading } from "@/components/GradientHeading";

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
          <div
            key={id}
            className={`p-4 ${
              role === "assistant"
                ? "bg-linear-to-r from-orange-500/5 to-red-600/5"
                : "bg-transparent"
            }`}
          >
            <div className="mx-auto flex w-full max-w-3xl items-start gap-4">
              {role === "assistant" ? (
                <div className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-r from-orange-500 to-red-600 text-sm font-medium text-white">
                  AI
                </div>
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-700 text-sm font-medium text-white">
                  Y
                </div>
              )}
              <div className="flex-1">
                {parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <div className="min-w-0 flex-1" key={index}>
                        <ReactMarkdown>{part.text}</ReactMarkdown>
                      </div>
                    );
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
      api: "/api/chat",
    }),
  });
  const [input, setInput] = useState("");

  const Layout = messages.length ? ChattingLayout : InitialLayout;

  return (
    <div className="relative flex h-[calc(100vh-32px)] bg-gray-900">
      <div className="flex flex-1 flex-col">
        <Messages messages={messages} />

        <Layout>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput("");
            }}
          >
            <div className="mx-auto flex max-w-xl space-x-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type something clever (or don't, we won't judge)..."
                className="w-full resize-none overflow-hidden rounded-lg border border-orange-500/20 bg-gray-800/50 py-3 pr-12 pl-4 text-sm text-white placeholder-gray-400 shadow-lg focus:border-transparent focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
                rows={1}
                style={{ minHeight: "44px", maxHeight: "200px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height =
                    Math.min(target.scrollHeight, 200) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage({ text: input });
                    setInput("");
                  }
                }}
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 text-orange-500 transition-colors hover:text-orange-400 focus:outline-none disabled:text-gray-500"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>{" "}
            a{" "}
          </form>
        </Layout>
      </div>
    </div>
  );
}
