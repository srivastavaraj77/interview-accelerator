import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string, options?: { pitch?: number; rate?: number; voiceIndex?: number }) => void;
  stop: () => void;
  voices: SpeechSynthesisVoice[];
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      if (!synthRef.current) return;
      const availableVoices = synthRef.current.getVoices();
      if (availableVoices && availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string, options?: { pitch?: number; rate?: number; voiceIndex?: number }) => {
      if (!synthRef.current || !text) return;

      // Stop any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.rate = options?.rate ?? 1.0;

      // Select best voice: English (Google US English, Samantha, Daniel, or English natural)
      if (voices.length > 0) {
        const preferredVoice =
          (options?.voiceIndex !== undefined && voices[options.voiceIndex]) ||
          voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))) ||
          voices.find(v => v.lang.startsWith('en')) ||
          voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis notification:', e);
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    },
    [voices]
  );

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
    voices
  };
}
