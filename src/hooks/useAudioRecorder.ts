// ============================================
// useAudioRecorder Hook — MediaRecorder API wrapper
// ============================================

import { useState, useRef, useCallback } from "react";
import type { Recording } from "@/types/notes.types";
import { getStorageItem, setStorageItem } from "@/utils/storage";

function generateRecordingId(): string {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useAudioRecorder(pageNum: number) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>(() =>
    getStorageItem<Recording[]>(`audio_${pageNum}`, [])
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          const duration = (Date.now() - startTimeRef.current) / 1000;
          const recording: Recording = {
            id: generateRecordingId(),
            pageNum,
            data: base64,
            duration,
            createdAt: Date.now(),
          };

          setRecordings((prev) => {
            const updated = [...prev, recording];
            setStorageItem(`audio_${pageNum}`, updated);
            return updated;
          });
        };
        reader.readAsDataURL(blob);

        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Failed to start recording:", e);
    }
  }, [pageNum]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const deleteRecording = useCallback(
    (id: string) => {
      setRecordings((prev) => {
        const updated = prev.filter((r) => r.id !== id);
        setStorageItem(`audio_${pageNum}`, updated);
        return updated;
      });
    },
    [pageNum]
  );

  return {
    isRecording,
    recordings,
    startRecording,
    stopRecording,
    deleteRecording,
  };
}
