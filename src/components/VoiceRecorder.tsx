import { useEffect, useRef, useState } from 'react';
import { canRecord, recorderMimeType } from '../lib/specialVoice';

const MAX_SECONDS = 20;

interface Props {
  playerName: string;
  /** The current recording, if any. */
  value: Blob | null;
  onChange: (blob: Blob | null) => void;
}

/** Record a short message with the device microphone, listen back, re-record or delete. */
export function VoiceRecorder({ playerName, value, onChange }: Props) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const audio = useRef<HTMLAudioElement | null>(null);

  const releaseMic = () => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    window.clearInterval(timer.current);
  };

  useEffect(
    () => () => {
      if (recorder.current?.state === 'recording') recorder.current.stop();
      releaseMic();
      audio.current?.pause();
    },
    [],
  );

  const start = async () => {
    setError('');
    if (!canRecord()) {
      setError('This browser can’t record audio. On iPad, use Safari on the published game.');
      return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError('No microphone access. On iPad: Settings → Safari → Microphone → Allow (or tap “Allow” when asked).');
      return;
    }
    const mimeType = recorderMimeType();
    const rec = new MediaRecorder(stream.current, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      releaseMic();
      setRecording(false);
      if (chunks.length) onChange(new Blob(chunks, { type: rec.mimeType || mimeType || 'audio/mp4' }));
    };
    recorder.current = rec;
    rec.start();
    setRecording(true);
    setSeconds(0);
    const began = Date.now();
    timer.current = window.setInterval(() => {
      const s = Math.floor((Date.now() - began) / 1000);
      setSeconds(s);
      if (s >= MAX_SECONDS && rec.state === 'recording') rec.stop();
    }, 250);
  };

  const stop = () => {
    if (recorder.current?.state === 'recording') recorder.current.stop();
  };

  const play = () => {
    if (!value) return;
    audio.current?.pause();
    const url = URL.createObjectURL(value);
    const el = new Audio(url);
    audio.current = el;
    setPlaying(true);
    const done = () => {
      setPlaying(false);
      URL.revokeObjectURL(url);
    };
    el.onended = done;
    el.onerror = done;
    el.play().catch(done);
  };

  return (
    <div className="recorder">
      <span className="recorder-label">🎙️ Record it in your voice (optional), so {playerName} hears you say it</span>
      <div className="recorder-row">
        {recording ? (
          <button className="rec-btn recording" onClick={stop}>
            ⏹ Stop <span className="rec-time">{seconds}s</span>
          </button>
        ) : (
          <button className="rec-btn" onClick={start}>
            {value ? '🔁 Re-record' : '⏺ Record'}
          </button>
        )}
        {value && !recording && (
          <>
            <button onClick={play} disabled={playing}>
              {playing ? '🔊 Playing…' : '▶ Listen'}
            </button>
            <button onClick={() => onChange(null)}>🗑 Delete recording</button>
          </>
        )}
      </div>
      {recording && <span className="hint">Recording… up to {MAX_SECONDS} seconds.</span>}
      {!value && !recording && !error && (
        <span className="hint">Without a recording, the message is read by the device’s voice.</span>
      )}
      {error && (
        <span className="rec-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
