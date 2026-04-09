/**
 * Web Speech API (Text-to-Speech) wrapper
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Speak the given text using the browser's Text-to-Speech API
 */
export function speak(text: string, rate: number = 0.9): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  stop();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = 1;
  utterance.lang = 'en-AU'; // Australian English

  // Try to find an Australian or English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) => v.lang === 'en-AU' || v.lang === 'en-GB' || v.lang === 'en-US'
  );
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any ongoing speech
 */
export function stop(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

/**
 * Pause speech
 */
export function pause(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.pause();
}

/**
 * Resume paused speech
 */
export function resume(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.resume();
}

/**
 * Check if speech synthesis is currently active
 */
export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}

/**
 * Speak a series of directions one by one
 */
export function speakDirections(directions: string[]): void {
  if (directions.length === 0) return;

  const fullText = directions
    .map((d, i) => `Step ${i + 1}: ${d}`)
    .join('. ');

  speak(fullText, 0.85);
}
