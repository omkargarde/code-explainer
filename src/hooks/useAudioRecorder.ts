import { useRef, useState } from "react";
import { FORMAT_CONFIG } from "@/constants/constants";

// https://blog.logrocket.com/how-to-create-video-audio-recorder-react/
export function useAudioRecorder() {
  const [permission, setPermission] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<
    "recording" | "inactive" | "paused"
  >("inactive");
  const [audioChunks, setAudioChunks] = useState<Array<Blob>>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  async function getMicrophonePermission() {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setStream(streamData);
        setPermission(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          alert(error.message);
        }
      }
    } else {
      alert("Your browser does not support audio recording.");
    }
  }

  function startRecording() {
    setRecordingStatus("recording");
    if (!stream) {
      console.error("media stream does not exists");
      alert("please try giving microphone permission again");
      setPermission(false);
      return;
    }
    const media = new MediaRecorder(stream, {
      mimeType: FORMAT_CONFIG.webm.type,
    });
    mediaRecorder.current = media;

    mediaRecorder.current.start();
    const localAudioChunks: Array<Blob> = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  }

  function stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      setRecordingStatus("inactive");
      if (!mediaRecorder.current) {
        console.error("media stream does not exists");
        alert("please try giving microphone permission again");
        setPermission(false);
        resolve(null);
        return;
      }
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, {
          type: FORMAT_CONFIG.webm.type,
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setAudioChunks([]);
        resolve(audioBlob);
      };
    });
  }

  return {
    permission,
    recordingStatus,
    audioUrl,
    getMicrophonePermission,
    startRecording,
    stopRecording,
  };
}
