/**
 * Infrastructure: Generic Text-to-Speech utilities (language-agnostic)
 */

/**
 * Check if TTS is supported
 * @returns {boolean} True if TTS is supported
 */
export function isTTSSupported() {
  return 'speechSynthesis' in window;
}

/**
 * Speak English text using Text-to-Speech
 * @param {string} text - Text to speak
 * @param {string} language - Language code (default: 'en-US')
 * @param {number} rate - Speech rate (default: 1.0)
 * @param {number} pitch - Speech pitch (default: 1.0)
 * @returns {Promise<boolean>} Success status
 */
export async function speakEnglishText(text, language = 'en-US', rate = 1.0, pitch = 1.0) {
  try {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return false;
    }
    
    window.speechSynthesis.cancel();
    
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 0.95;
      
      try {
        const trySetBestVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            const preferredNames = [
              'Samantha', 'Alex', 'Victoria', 'Daniel',
              'Google US English', 'Google UK English Male', 'Google UK English Female',
              'Microsoft Aria Online (Natural) - English (United States)'
            ];
            const englishVoices = voices.filter(v => 
              (v.lang && v.lang.toLowerCase().startsWith('en')) ||
              (v.name && (/english/i).test(v.name))
            );
            const byName = preferredNames
              .map(name => englishVoices.find(v => v.name === name))
              .find(Boolean);
            const selected = byName || englishVoices[0] || null;
            if (selected) {
              utterance.voice = selected;
              if (selected.lang) utterance.lang = selected.lang;
            }
            window.speechSynthesis.speak(utterance);
          } else {
            window.speechSynthesis.speak(utterance);
          }
        };
        if (window.speechSynthesis.getVoices().length === 0) {
          const onVoices = () => {
            window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
            trySetBestVoice();
          };
          window.speechSynthesis.addEventListener('voiceschanged', onVoices);
          setTimeout(() => {
            try {
              window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
            } catch {}
            trySetBestVoice();
          }, 250);
        } else {
          trySetBestVoice();
        }
      } catch {
        window.speechSynthesis.speak(utterance);
      }
      
      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);
    });
  } catch (error) {
    console.warn('Failed to speak English text:', error);
    return false;
  }
}


