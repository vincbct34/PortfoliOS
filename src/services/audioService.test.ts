import { describe, it, expect, vi, afterEach } from 'vitest';
import { audioService, type SoundType } from './audioService';

describe('audioService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('play method', () => {
    const soundTypes: SoundType[] = [
      'click',
      'hover',
      'notification',
      'success',
      'error',
      'window-open',
      'window-close',
      'startup',
      'game-eat',
      'game-over',
    ];

    soundTypes.forEach((soundType) => {
      it(`should play ${soundType} sound without throwing`, () => {
        expect(() => audioService.play(soundType)).not.toThrow();
      });
    });

    it('should use default volume of 100 when not specified', () => {
      expect(() => audioService.play('click')).not.toThrow();
    });

    it('should accept custom volume parameter', () => {
      expect(() => audioService.play('click', 50)).not.toThrow();
    });

    it('should handle volume of 0', () => {
      expect(() => audioService.play('click', 0)).not.toThrow();
    });

    it('should handle volume of 100', () => {
      expect(() => audioService.play('click', 100)).not.toThrow();
    });
  });

  describe('setVolume method', () => {
    it('should not throw when setting volume', () => {
      expect(() => audioService.setVolume(50)).not.toThrow();
    });

    it('should handle 0 volume', () => {
      expect(() => audioService.setVolume(0)).not.toThrow();
    });

    it('should handle 100 volume', () => {
      expect(() => audioService.setVolume(100)).not.toThrow();
    });
  });

  describe('exported singleton', () => {
    it('should export audioService as singleton', () => {
      expect(audioService).toBeDefined();
      expect(typeof audioService.play).toBe('function');
      expect(typeof audioService.setVolume).toBe('function');
    });
  });

  describe('sound characteristics', () => {
    it('should handle notification sound with double ding', () => {
      expect(() => audioService.play('notification')).not.toThrow();
    });

    it('should handle startup sound with chord', () => {
      expect(() => audioService.play('startup')).not.toThrow();
    });

    it('should handle error sound with sawtooth wave', () => {
      expect(() => audioService.play('error')).not.toThrow();
    });

    it('should handle game-over sound with descending slide', () => {
      expect(() => audioService.play('game-over')).not.toThrow();
    });

    it('should handle game-eat sound with retro blip', () => {
      expect(() => audioService.play('game-eat')).not.toThrow();
    });
  });
});
