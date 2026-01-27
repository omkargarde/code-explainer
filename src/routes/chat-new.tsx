import { createFileRoute } from "@tanstack/react-router";
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { useState } from "react";
import { Messages } from "@/components/messages";
import { PROMPTS } from "@/constants/constants";

export const Route = createFileRoute("/chat-new")({
  component: ChatNew,
});

function ChatNew() {
  const [isQuestionOrFeedback, setIsQuestionOrFeedback] = useState<
    "question" | "feedback"
  >("question");

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents("/api/generate-questions-new"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // setIsQuestionOrFeedback("feedback");
    sendMessage(PROMPTS.user_prompt.new_question);
  }

  return (
    <div className="flex flex-col h-screen">
      <Messages messages={messages} />

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="mx-auto flex max-w-xl space-x-3">
          {/* question question*/}
          {isQuestionOrFeedback === "question" && (
            <button
              type="submit"
              className="btn btn-primary flex items-center p-2"
            >
              Generate questions
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
