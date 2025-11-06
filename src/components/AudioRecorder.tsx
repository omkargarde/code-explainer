import { useRef, useState } from "react";

function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Array<Blob>>([]);

  const startRecording = async () => {
    try {
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
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
