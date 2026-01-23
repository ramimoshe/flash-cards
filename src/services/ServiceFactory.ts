import { ITranslationService } from './interfaces/ITranslationService';
import { ISentenceGeneratorService } from './interfaces/ISentenceGeneratorService';
import { ITTSService } from './interfaces/ITTSService';
import { IStorageService } from './interfaces/IStorageService';
import { ICEFRService } from './interfaces/ICEFRService';

import { GoogleTranslateService } from './implementations/GoogleTranslateService';
import { MyMemoryTranslationService } from './implementations/MyMemoryTranslationService';
import { LibreTranslateService } from './implementations/LibreTranslateService';
import { FreeDictionaryService } from './implementations/FreeDictionaryService';
import { WordnikService } from './implementations/WordnikService';
import { BrowserTTSService } from './implementations/BrowserTTSService';
import { GoogleTTSService } from './implementations/GoogleTTSService';
import { LocalStorageService } from './implementations/LocalStorageService';
import { CEFRDatasetService } from './implementations/CEFRDatasetService';
import { OfflineTranslationService } from './implementations/OfflineTranslationService';
import { OfflineSentenceService } from './implementations/OfflineSentenceService';

import {
  TranslationProvider,
  SentenceProvider,
  TTSProvider,
} from '@/types/ServiceConfig';

export class ServiceFactory {
  // Singleton instances
  private static cefrServiceInstance: ICEFRService | null = null;

  static createTranslationService(
    type: TranslationProvider = 'google',
    isOfflineMode: boolean = false
  ): ITranslationService {
    // Force offline service when offline mode is enabled
    if (isOfflineMode) {
      console.log('📴 Offline mode: Using offline translation service');
      return new OfflineTranslationService();
    }

    switch (type) {
      case 'google':
        return new GoogleTranslateService();
      case 'libretranslate':
        return new LibreTranslateService();
      case 'mymemory':
        return new MyMemoryTranslationService();
      default:
        return new GoogleTranslateService();
    }
  }

  static createSentenceGeneratorService(
    type: SentenceProvider = 'freedictionary',
    apiKey?: string,
    isOfflineMode: boolean = false
  ): ISentenceGeneratorService {
    // Force offline service when offline mode is enabled
    if (isOfflineMode) {
      console.log('📴 Offline mode: Using offline sentence service');
      return new OfflineSentenceService();
    }

    switch (type) {
      case 'wordnik':
        return new WordnikService(apiKey);
      case 'freedictionary':
      default:
        return new FreeDictionaryService();
    }
  }

  static createTTSService(
    type: TTSProvider = 'browser',
    apiKey?: string,
    isOfflineMode: boolean = false
  ): ITTSService {
    // FORCE Browser TTS when offline, regardless of user preference
    if (isOfflineMode) {
      console.log('📴 Offline mode: Using Browser TTS');
      return new BrowserTTSService();
    }

    switch (type) {
      case 'google':
        return new GoogleTTSService(apiKey);
      case 'browser':
      default:
        return new BrowserTTSService();
    }
  }

  static createStorageService(): IStorageService {
    return new LocalStorageService();
  }

  static createCEFRService(): ICEFRService {
    // Return singleton instance - only create once
    if (!this.cefrServiceInstance) {
      this.cefrServiceInstance = new CEFRDatasetService();
      // Preload the dataset immediately
      (this.cefrServiceInstance as CEFRDatasetService).loadDataset();
    }
    return this.cefrServiceInstance;
  }
}
