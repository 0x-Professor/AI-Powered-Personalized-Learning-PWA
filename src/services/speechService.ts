interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: number;
  language?: string;
}

export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListeningFlag: boolean = false;
  private isSpeakingFlag: boolean = false;

  constructor() {
    this.synthesis = window.speechSynthesis;

    // Initialize speech recognition if supported
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionImpl();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  public isSpeechSupported(): boolean {
    return (
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) &&
      'speechSynthesis' in window
    );
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  public isListening(): boolean {
    return this.isListeningFlag;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingFlag;
  }

  public async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = this.getVoices();

      // Apply options
      if (options.rate !== undefined) utterance.rate = options.rate;
      if (options.pitch !== undefined) utterance.pitch = options.pitch;
      if (options.volume !== undefined) utterance.volume = options.volume;
      if (options.voice !== undefined && voices[options.voice]) {
        utterance.voice = voices[options.voice];
      }
      if (options.language) utterance.lang = options.language;

      utterance.onstart = () => {
        this.isSpeakingFlag = true;
      };

      utterance.onend = () => {
        this.isSpeakingFlag = false;
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeakingFlag = false;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.synthesis.speak(utterance);
    });
  }

  public startListening(callback: (text: string, isFinal: boolean) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListeningFlag) {
        resolve();
        return;
      }

      this.recognition.onstart = () => {
        this.isListeningFlag = true;
        resolve();
      };

      this.recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const isFinal = event.results[i].isFinal;
          callback(transcript, isFinal);
        }
      };

      this.recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.error('Speech recognition error:', event.error);
          this.stopListening();
          reject(new Error(`Speech recognition error: ${event.error}`));
        }
      };

      this.recognition.onend = () => {
        // Automatically restart if we're still supposed to be listening
        if (this.isListeningFlag) {
          this.recognition?.start();
        }
      };

      try {
        this.recognition.start();
      } catch (error) {
        reject(error);
      }
    });
  }

  public stopListening(): void {
    if (this.recognition && this.isListeningFlag) {
      this.isListeningFlag = false;
      this.recognition.stop();
    }
  }

  public cancel(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeakingFlag = false;
    }
  }

  public pause(): void {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  public resume(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }
}