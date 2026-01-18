export interface ITTSService {
  speak(text: string, lang: string): Promise<void>;
  stop(): void;
  pause(): void;
  resume(): void;
  isAvailable(): boolean;
  getName(): string;
}
