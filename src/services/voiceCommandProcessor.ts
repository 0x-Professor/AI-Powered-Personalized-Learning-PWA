import { SpeechService } from "./speechService";
import { notificationService } from "./notificationService";

type CommandHandler = () => void;
type NavigateFunction = (path: string) => void;

interface VoiceCommand {
  patterns: string[];
  handler: CommandHandler;
  description: string;
}

export class VoiceCommandProcessor {
  private commands: VoiceCommand[] = [];
  private navigate: NavigateFunction | null = null;
  private speechService = new SpeechService();

  constructor() {
    this.initializeCommands();
  }

  setNavigate(navigateFunc: NavigateFunction) {
    this.navigate = navigateFunc;
    this.initializeCommands();
  }

  private initializeCommands() {
    this.commands = [];  // Reset commands before re-initializing
    
    // Navigation commands
    this.registerCommand({
      patterns: ['go to courses', 'show courses', 'open courses'],
      handler: () => this.navigate?.('/courses'),
      description: 'Navigate to courses page'
    });

    this.registerCommand({
      patterns: ['show my learning', 'open my learning', 'go to my learning'],
      handler: () => this.navigate?.('/my-learning'),
      description: 'Navigate to my learning page'
    });

    this.registerCommand({
      patterns: ['open assistant', 'show assistant', 'talk to assistant'],
      handler: () => this.navigate?.('/assistant'),
      description: 'Open AI assistant'
    });

    this.registerCommand({
      patterns: ['go home', 'take me home', 'show home'],
      handler: () => this.navigate?.('/'),
      description: 'Navigate to home page'
    });

    // Content control commands
    this.registerCommand({
      patterns: ['read this', 'start reading', 'read content'],
      handler: () => this.speechService.speak('Reading content...'),
      description: 'Start reading content'
    });

    this.registerCommand({
      patterns: ['stop reading', 'pause reading', 'stop speaking'],
      handler: () => this.speechService.cancel(),
      description: 'Stop reading content'
    });

    this.registerCommand({
      patterns: ['speak faster', 'increase speed', 'faster'],
      handler: () => this.speechService.speak('Speed increased'),
      description: 'Increase reading speed'
    });

    this.registerCommand({
      patterns: ['speak slower', 'decrease speed', 'slower'],
      handler: () => this.speechService.speak('Speed decreased'),
      description: 'Decrease reading speed'
    });

    // Help commands
    this.registerCommand({
      patterns: ['what can i say', 'show commands', 'help me', 'show guide'],
      handler: () => {
        document.dispatchEvent(new Event('showVoiceGuide'));
      },
      description: 'Show voice command guide'
    });
  }

  registerCommand(command: VoiceCommand) {
    this.commands.push(command);
  }

  async processCommand(speech: string): Promise<boolean> {
    const normalizedSpeech = speech.toLowerCase().trim();
    
    for (const command of this.commands) {
      if (command.patterns.some(pattern => normalizedSpeech.includes(pattern))) {
        try {
          await command.handler();
          return true;
        } catch (error) {
          notificationService.show({
            type: 'error',
            message: 'Failed to execute voice command'
          });
          return false;
        }
      }
    }

    return false;
  }

  getAvailableCommands(): string[] {
    return this.commands.map(cmd => cmd.patterns[0]);
  }
}

export const voiceCommandProcessor = new VoiceCommandProcessor();