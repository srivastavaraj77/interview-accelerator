import React, { useRef, useEffect, useState } from 'react';
import {
  InterviewerPersona,
  InterviewLevel
} from '../types';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  VolumeX,
  Radio,
  Gauge,
  Sparkles,
  AlertTriangle,
  Clock,
  RefreshCw
} from 'lucide-react';

interface VideoRoomProps {
  interviewer: InterviewerPersona;
  currentLevel: InterviewLevel;
  questionNumber: number;
  currentQuestionText: string;
  category: string;
  isAiSpeaking: boolean;
  isCandidateListening: boolean;
  audioLevel: number;
  durationSec: number;
  wpm: number;
  fillerCount: number;
  pacingVerdict: string;
  onReplayAiVoice: () => void;
  isAdaptiveFollowUp?: boolean;
}

export const VideoRoom: React.FC<VideoRoomProps> = ({
  interviewer,
  currentLevel,
  questionNumber,
  currentQuestionText,
  category,
  isAiSpeaking,
  isCandidateListening,
  audioLevel,
  durationSec,
  wpm,
  fillerCount,
  pacingVerdict,
  onReplayAiVoice,
  isAdaptiveFollowUp
}) => {
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream
  useEffect(() => {
    let active = true;

    async function startCamera() {
      if (!cameraEnabled) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false
        });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraError(null);
      } catch (err) {
        console.warn('Webcam stream unavailable:', err);
        setCameraError('Webcam preview unavailable. Mock video mode active.');
      }
    }

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraEnabled]);

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Level Badge
  const levelLabels = {
    1: { name: 'Level 1: Screening', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    2: { name: 'Level 2: Competency', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    3: { name: 'Level 3: Deep-Dive Challenge', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' }
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Telemetry HUD Bar */}
      <div className="glass-card rounded-2xl p-4 border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Level & Question Counter */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${levelLabels[currentLevel].bg}`}>
            {levelLabels[currentLevel].name}
          </span>
          <span className="text-xs font-mono text-slate-400">
            Question #{questionNumber}
          </span>
          {isAdaptiveFollowUp && (
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3" /> Adaptive Follow-up Probe
            </span>
          )}
        </div>

        {/* Live Real-Time Telemetry Counters */}
        <div className="flex items-center gap-4 text-xs font-mono">
          {/* Duration */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTime(durationSec)}</span>
          </div>

          {/* Speaking Pace (WPM) */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">{wpm} WPM</span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">({pacingVerdict.split(' ')[0]})</span>
          </div>

          {/* Filler Word Counter */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
            fillerCount > 4
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-slate-900 text-slate-300 border-slate-800'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{fillerCount} Fillers</span>
          </div>
        </div>
      </div>

      {/* Video Conference Room (Side-by-Side Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: AI Interviewer Video Avatar Feed */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex flex-col justify-between p-6 shadow-2xl">
          {/* Background Ambient Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${interviewer.avatarBg} opacity-10`} />

          {/* Top Panel Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-xs font-bold text-slate-200">{interviewer.name}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">({interviewer.style})</span>
            </div>

            <button
              onClick={onReplayAiVoice}
              title="Replay Spoken Question"
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-indigo-400" />
              <span>Replay Audio</span>
            </button>
          </div>

          {/* Center: AI Avatar with Audio-Reactive Ripple / Waves */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Pulsing Ripple rings when AI is speaking */}
              {isAiSpeaking && (
                <>
                  <div className="absolute w-36 h-36 rounded-full border-2 border-indigo-500/40 animate-ping pointer-events-none" />
                  <div className="absolute w-44 h-44 rounded-full border border-purple-500/30 animate-pulse pointer-events-none" />
                </>
              )}
              <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr ${interviewer.avatarBg} flex items-center justify-center text-4xl sm:text-5xl shadow-2xl border-2 border-white/20 transition-transform ${isAiSpeaking ? 'scale-105 shadow-indigo-500/50' : 'scale-100'}`}>
                {interviewer.avatar}
              </div>
            </div>

            {/* Audio Waveform Bars */}
            <div className="h-6 flex items-center gap-1 mt-4">
              {isAiSpeaking ? (
                <>
                  <span className="w-1 bg-indigo-400 rounded-full animate-wave-1" />
                  <span className="w-1 bg-purple-400 rounded-full animate-wave-2" />
                  <span className="w-1 bg-pink-400 rounded-full animate-wave-3" />
                  <span className="w-1 bg-indigo-400 rounded-full animate-wave-4" />
                  <span className="w-1 bg-cyan-400 rounded-full animate-wave-5" />
                  <span className="w-1 bg-purple-400 rounded-full animate-wave-2" />
                  <span className="w-1 bg-indigo-400 rounded-full animate-wave-1" />
                </>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-slate-600" /> Listening to your answer...
                </span>
              )}
            </div>
          </div>

          {/* Bottom Question Prompt Subtitle Overlay */}
          <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-0.5">
              {category}
            </div>
            <p className="text-xs sm:text-sm text-slate-100 font-medium line-clamp-2">
              "{currentQuestionText}"
            </p>
          </div>
        </div>

        {/* Right: Candidate Webcam Feed & Mic Audio Meter */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex flex-col justify-between p-6 shadow-2xl">
          {/* Live Video Stream */}
          {cameraEnabled && !cameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-90"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-slate-500 p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mb-2">
                👤
              </div>
              <p className="text-xs text-slate-400">{cameraError || 'Camera is turned off'}</p>
            </div>
          )}

          {/* Top Candidate Controls */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
              <span className={`w-2.5 h-2.5 rounded-full ${isCandidateListening ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-xs font-bold text-white">You (Candidate)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                  cameraEnabled
                    ? 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
                title={cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {cameraEnabled ? <VideoIcon className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Face Framing Overlay Guide (Subtle center reticle) */}
          {cameraEnabled && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
              <div className="w-40 h-52 border border-dashed border-white rounded-3xl" />
            </div>
          )}

          {/* Bottom Live Audio Amplitude Meter */}
          <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${isCandidateListening ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                {isCandidateListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-mono text-slate-300">
                {isCandidateListening ? 'Mic Active' : 'Mic Inactive'}
              </span>
            </div>

            {/* Amplitude Volume Bar */}
            <div className="flex-1 max-w-xs h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-75 ${
                  audioLevel > 60 ? 'bg-rose-500' : audioLevel > 20 ? 'bg-emerald-400' : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.max(audioLevel, 4)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
