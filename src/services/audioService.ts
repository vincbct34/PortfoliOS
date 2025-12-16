export type SoundType =
  | 'click'
  | 'hover'
  | 'notification'
  | 'success'
  | 'error'
  | 'window-open'
  | 'window-close'
  | 'startup'
  | 'shutdown'
  | 'game-eat'
  | 'game-over';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

class AudioService {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private init() {
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.context) {
      // Smooth transition
      this.masterGain.gain.setTargetAtTime(volume / 100, this.context.currentTime, 0.05);
    }
  }

  public play(type: SoundType, volume: number = 100) {
    try {
      this.init();
      if (!this.context || !this.masterGain) return;

      const t = this.context.currentTime;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain);

      // Apply specific sound characteristics
      switch (type) {
        case 'click':
          // Short, high-pitch click
          osc.frequency.setValueAtTime(800, t);
          osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
          gain.gain.setValueAtTime(0.05 * (volume / 100), t); // Very quiet
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          osc.start(t);
          osc.stop(t + 0.05);
          break;

        case 'hover':
          // Very subtle tick
          osc.frequency.setValueAtTime(400, t);
          gain.gain.setValueAtTime(0.02 * (volume / 100), t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
          osc.start(t);
          osc.stop(t + 0.02);
          break;

        case 'notification': {
          // Double ding (Crystal like)
          // First note
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, t); // A5
          gain.gain.setValueAtTime(0.3 * (volume / 100), t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
          osc.start(t);
          osc.stop(t + 0.5);

          // Second note (harmonic)
          const osc2 = this.context.createOscillator();
          const gain2 = this.context.createGain();
          osc2.connect(gain2);
          gain2.connect(this.masterGain);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1760, t + 0.1); // A6
          gain2.gain.setValueAtTime(0.15 * (volume / 100), t + 0.1);
          gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
          osc2.start(t + 0.1);
          osc2.stop(t + 0.6);
          break;
        }

        case 'success':
          // Ascending major triad
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.setValueAtTime(554, t + 0.1);
          osc.frequency.setValueAtTime(659, t + 0.2);
          gain.gain.setValueAtTime(0.1 * (volume / 100), t);
          gain.gain.linearRampToValueAtTime(0.1, t + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc.start(t);
          osc.stop(t + 0.4);
          break;

        case 'error':
          // Low buzz
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(150, t);
          osc.frequency.linearRampToValueAtTime(100, t + 0.2);
          gain.gain.setValueAtTime(0.15 * (volume / 100), t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          osc.start(t);
          osc.stop(t + 0.3);
          break;

        case 'window-open':
          // Air swish enter
          osc.type = 'sine';
          // Noise buffer would be better but simple sine sweep works
          osc.frequency.setValueAtTime(200, t);
          osc.frequency.exponentialRampToValueAtTime(600, t + 0.15);
          gain.gain.setValueAtTime(0.01, t);
          gain.gain.linearRampToValueAtTime(0.15 * (volume / 100), t + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          osc.start(t);
          osc.stop(t + 0.15);
          break;

        case 'window-close':
          // Air swish exit (descending)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, t);
          osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);
          gain.gain.setValueAtTime(0.01, t);
          gain.gain.linearRampToValueAtTime(0.15 * (volume / 100), t + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          osc.start(t);
          osc.stop(t + 0.15);
          break;

        case 'startup': {
          // Futuristic boot chime
          // Chord: Cmaj7 (C, E, G, B)
          const frequencies = [523.25, 659.25, 783.99, 987.77];
          frequencies.forEach((freq, i) => {
            const o = this.context!.createOscillator();
            const g = this.context!.createGain();
            o.type = 'sine';
            o.connect(g);
            g.connect(this.masterGain!);
            o.frequency.setValueAtTime(freq, t + i * 0.1); // Staggered entry
            g.gain.setValueAtTime(0, t + i * 0.1);
            g.gain.linearRampToValueAtTime(0.1 * (volume / 100), t + i * 0.1 + 0.2);
            g.gain.exponentialRampToValueAtTime(0.001, t + 2); // Long tail
            o.start(t + i * 0.1);
            o.stop(t + 2);
          });
          break;
        }

        case 'shutdown': {
          // Descending chime
          const frequencies = [987.77, 783.99, 659.25, 523.25]; // Reversed Cmaj7
          frequencies.forEach((freq, i) => {
            const o = this.context!.createOscillator();
            const g = this.context!.createGain();
            o.type = 'sine';
            o.connect(g);
            g.connect(this.masterGain!);
            o.frequency.setValueAtTime(freq, t + i * 0.15);
            g.gain.setValueAtTime(0, t + i * 0.15);
            g.gain.linearRampToValueAtTime(0.08 * (volume / 100), t + i * 0.15 + 0.1);
            g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.8);
            o.start(t + i * 0.15);
            o.stop(t + i * 0.15 + 0.8);
          });
          break;
        }

        case 'game-eat':
          // Retro blip
          osc.type = 'square';
          osc.frequency.setValueAtTime(600, t);
          osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
          gain.gain.setValueAtTime(0.1 * (volume / 100), t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          osc.start(t);
          osc.stop(t + 0.1);
          break;

        case 'game-over':
          // Descending slide
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(400, t);
          osc.frequency.linearRampToValueAtTime(100, t + 0.5);
          gain.gain.setValueAtTime(0.2 * (volume / 100), t);
          gain.gain.linearRampToValueAtTime(0, t + 0.5);
          osc.start(t);
          osc.stop(t + 0.5);
          break;
      }
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  }
}

export const audioService = new AudioService();
