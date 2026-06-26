import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Background ambience that auto-plays on load. Browsers block autoplay with sound
// until a user gesture, so we attempt play immediately and fall back to the first
// interaction (pointer / key / scroll). A speaker button toggles it.
export default function AudioToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;

    const tryPlay = () =>
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));

    tryPlay();

    const onGesture = () => {
      if (audio.paused) tryPlay();
      if (!audio.paused) cleanup();
    };
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, onGesture));
    events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/Weathermix.ogg" type="audio/ogg" />
        <source src="/audio/Weathermix.m4a" type="audio/mp4" />
        <source src="/audio/Weathermix.mp3" type="audio/mpeg" />
      </audio>
      <button
        type="button"
        onClick={toggle}
        data-testid="audio-toggle"
        aria-label={playing ? 'Mute background music' : 'Play background music'}
        aria-pressed={playing}
        className="pointer-events-auto grid place-items-center w-9 h-9 rounded-full glass text-night hover:text-ice transition-colors"
      >
        {playing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>
    </>
  );
}
