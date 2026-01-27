import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import type { IQuestion } from "@/typing/questions";
import { GradientHeading } from "@/components/GradientHeading";
import { QuestionCard } from "@/components/QuestionCard";
import { FORMAT_CONFIG, PROMPTS } from "@/constants/constants";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Messages } from "@/components/messages";

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

function ChatPage() {
  const [isQuestionOrFeedback, setIsQuestionOrFeedback] = useState<
    "question" | "feedback"
  >("question");
  const latestQuestionRef = useRef<IQuestion | null>(null);

  const {
    permission,
    recordingStatus,
    audioUrl,
    getMicrophonePermission,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate-questions",
    }),
  });

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.role === "assistant") {
        for (const part of latestMessage.parts) {
          if (part.type === "text") {
            try {
              const jsonData = JSON.parse(part.text);
              if (Array.isArray(jsonData) && jsonData.length > 0) {
                latestQuestionRef.current = jsonData[0];
                console.log("Latest question:", latestQuestionRef.current);
              }
            } catch {}
            break;
          }
        }
      }
    }
  }, [messages]);

  const Layout = messages.length ? ChattingLayout : InitialLayout;

  async function handleStopRecording() {
    const audioBlob = await stopRecording();
    if (audioBlob) {
      const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
        type: audioBlob.type,
      });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      sendMessage({
        parts: [
          {
            type: "file",
            url: reader.result as string,
            mediaType: FORMAT_CONFIG.webm.type, // or 'audio/mpeg', etc.
          },
          {
            type: "text",
            text: "Please transcribe and summarize this audio.",
          },
        ],
      });
    }
  }

  return (
    <div className="relative flex h-screen bg-gray-900">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* <Messages messages={messages} />*/}

        <Layout>
          <div className="mx-auto flex max-w-xl space-x-3">
            {/* question question*/}
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

            {/* record audio*/}
            {isQuestionOrFeedback === "feedback" && (
              <>
                {!permission && (
                  <button
                    onClick={getMicrophonePermission}
                    className="btn btn-primary"
                  >
                    Allow Microphone
                  </button>
                )}
                {permission && (
                  <>
                    {recordingStatus === "inactive" && !audioUrl && (
                      <button
                        onClick={startRecording}
                        className="btn btn-primary"
                        type="button"
                      >
                        Record
                      </button>
                    )}
                    {recordingStatus === "recording" && (
                      <button
                        onClick={handleStopRecording}
                        className="btn btn-warning"
                        type="button"
                      >
                        Stop
                      </button>
                    )}
                    {audioUrl && (
                      <audio src={audioUrl} controls className="max-w-full" />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </Layout>
      </div>
    </div>
  );
}
