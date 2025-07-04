import { navigate } from '@reach/router';
import { speechService } from './speechService';
import { notificationService } from './notificationService';

type CommandHandler = () => void;

interface VoiceCommand {
  patterns: string[];
  handler: CommandHandler;
  description: string;
}

class VoiceCommandProcessor {
  private commands: VoiceCommand[] = [];

  constructor() {
    this.initializeCommands();
  }

  private initializeCommands() {
    // Navigation commands
    this.registerCommand({
      patterns: ['go to courses', 'show courses', 'open courses'],
      handler: () => navigate('/courses'),
      description: 'Navigate to courses page'
    });

    this.registerCommand({
      patterns: ['show my learning', 'open my learning', 'go to my learning'],
      handler: () => navigate('/my-learning'),
      description: 'Navigate to my learning page'
    });

    this.registerCommand({
      patterns: ['open assistant', 'show assistant', 'talk to assistant'],
      handler: () => navigate('/assistant'),
      description: 'Open AI assistant'
    });

    this.registerCommand({
      patterns: ['go home', 'take me home', 'show home'],
      handler: () => navigate('/'),
      description: 'Navigate to home page'
    });

    // Content control commands
    this.registerCommand({
      patterns: ['read this', 'start reading', 'read content'],
      handler: () => speechService.startReading(),
      description: 'Start reading content'
    });

    this.registerCommand({
      patterns: ['stop reading', 'pause reading', 'stop speaking'],
      handler: () => speechService.stopReading(),
      description: 'Stop reading content'
    });

    this.registerCommand({
      patterns: ['speak faster', 'increase speed', 'faster'],
      handler: () => speechService.adjustSpeed(0.1),
      description: 'Increase reading speed'
    });

    this.registerCommand({
      patterns: ['speak slower', 'decrease speed', 'slower'],
      handler: () => speechService.adjustSpeed(-0.1),
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