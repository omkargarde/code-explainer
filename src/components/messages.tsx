import { useEffect } from "react";
import { QuestionCard } from "./QuestionCard";
import type { UIMessage } from "@tanstack/ai-react";

export function Messages({ messages }: { messages: Array<UIMessage> }) {
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-r from-orange-500 to-orange-600 text-sm font-medium text-white">
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
                      const jsonData = JSON.parse(part.content);
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
                        {part.content}
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
