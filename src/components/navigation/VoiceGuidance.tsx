'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { speak, stop, pause, resume, isSpeaking } from '@/lib/speech';
import Button from '@/components/ui/Button';

interface VoiceGuidanceProps {
  directions: string[];
  enabled: boolean;
}

export default function VoiceGuidance({ directions, enabled }: VoiceGuidanceProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  if (!enabled) return null;

  const handlePlay = () => {
    if (directions.length === 0) return;

    if (isPaused) {
      resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    const fullText = directions
      .map((d, i) => `Step ${i + 1}. ${d}`)
      .join('. ');

    speak(fullText);
    setIsPlaying(true);
    setIsPaused(false);

    // Check when speech ends
    const checkEnd = setInterval(() => {
      if (!isSpeaking()) {
        setIsPlaying(false);
        setIsPaused(false);
        clearInterval(checkEnd);
      }
    }, 500);
  };

  const handlePause = () => {
    pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Voice guidance controls"
    >
      {!isPlaying ? (
        <Button
          variant="secondary"
          size="sm"
          icon={isPaused ? <Play size={16} /> : <Volume2 size={16} />}
          onClick={handlePlay}
          aria-label={isPaused ? 'Resume voice directions' : 'Play voice directions'}
        >
          {isPaused ? 'Resume' : 'Voice'}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          icon={<Pause size={16} />}
          onClick={handlePause}
          aria-label="Pause voice directions"
        >
          Pause
        </Button>
      )}

      {(isPlaying || isPaused) && (
        <Button
          variant="ghost"
          size="sm"
          icon={<VolumeX size={16} />}
          onClick={handleStop}
          aria-label="Stop voice directions"
        >
          Stop
        </Button>
      )}
    </div>
  );
}
