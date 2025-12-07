import { useEffect, useRef, useState } from "react";
import type { IQuestionItem } from "./questions-typing";
import { FORMAT_CONFIG } from "@/constants/constants";
import ErrorMessage from "@/components/Error";

function AudioRecorder(props: {
  question: IQuestionItem;
  feedbackMutation: (data: FormData) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Array<Blob>>([]);
  const [permissionIsDenied, setPermissionIsDenied] = useState(false);

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      // Clean up any previous recording
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
      }

      // Ask for microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create a MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // On data available, push chunks
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // When recording stops, create a Blob
      mediaRecorder.onstop = () => {
        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, {
          type: FORMAT_CONFIG.webm.type,
        });

        const formDataToUpload = new FormData();

        const filename = `audio_recording${FORMAT_CONFIG.webm.extension}`;
        formDataToUpload.append("audio", audioBlob, filename);

        formDataToUpload.append("question", props.question.question);

        props.feedbackMutation(formDataToUpload);

        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setPermissionIsDenied(true);
      console.error("Microphone access denied or error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 p-4">
      <h2 className="text-lg font-semibold">🎤 Audio Recorder</h2>
      {permissionIsDenied && (
        <ErrorMessage error="permission for microphone is required, please start recording again and allow microphone access" />
      )}
      <div className="space-x-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="rounded bg-green-500 px-4 py-2 text-white"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="rounded bg-red-500 px-4 py-2 text-white"
          >
            Stop Recording
          </button>
        )}
      </div>

      {audioURL && (
        <div className="mt-4">
          <audio controls src={audioURL}></audio>
          <a
            href={audioURL}
            download="recording.webm"
            className="ml-3 text-blue-600 underline"
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
