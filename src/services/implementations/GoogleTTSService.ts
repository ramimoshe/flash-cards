import { ITTSService } from '@/services/interfaces/ITTSService';

export class GoogleTTSService implements ITTSService {
  private apiKey: string;
  private audio: HTMLAudioElement | null = null;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  async speak(text: string, lang: string): Promise<void> {
    if (!this.apiKey) {
      throw new Error('Google TTS API key not provided');
    }

    try {
      const url = 'https://texttospeech.googleapis.com/v1/text:synthesize';
      const languageCode = lang === 'he' ? 'he-IL' : 'en-US';

      const response = await fetch(`${url}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode,
            ssmlGender: 'NEUTRAL',
          },
          audioConfig: {
            audioEncoding: 'MP3',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Google TTS API request failed');
      }

      const data = await response.json();
      if (!data.audioContent) {
        throw new Error('No audio content received');
      }

      // Play the audio
      this.stop();
      this.audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      await this.audio.play();
    } catch (error) {
      console.error('Google TTS error:', error);
      throw error;
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  resume(): void {
    if (this.audio) {
      this.audio.play();
    }
  }

  isAvailable(): boolean {
    return this.apiKey.length > 0 && typeof Audio !== 'undefined';
  }

  getName(): string {
    return 'Google TTS';
  }
}
