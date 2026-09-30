import { useState, useCallback } from "react";
import {
  getAudioEnabled,
  setAudioEnabled,
  playClick as playClickUtil,
  playBlip as playBlipUtil,
  playWarp as playWarpUtil,
} from "../utils/audio";

/**
 * Custom hook to control audio feedback throughout the portfolio application.
 */
export function useAudio() {
  const [audioEnabled, setAudioState] = useState(() => getAudioEnabled());

  const toggleAudio = useCallback(() => {
    setAudioState((prev) => {
      const next = !prev;
      setAudioEnabled(next);
      return next;
    });
  }, []);

  const playClick = useCallback(() => {
    playClickUtil();
  }, []);

  const playBlip = useCallback(() => {
    playBlipUtil();
  }, []);

  const playWarp = useCallback(() => {
    playWarpUtil();
  }, []);

  return {
    audioEnabled,
    toggleAudio,
    playClick,
    playBlip,
    playWarp,
  };
}
