// Gentle Web Audio API synthesized koto pluck & chime sound effects for the Kimono Design Game

class SoundController {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Soft Japanese Yo-scale pentatonic koto pluck (D4, E4, G4, A4, B4, D5)
  public playKotoPluck(noteIndex = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    const pentatonicFreqs = [293.66, 329.63, 392.0, 440.0, 493.88, 587.33, 659.25];
    const freq = pentatonicFreqs[Math.abs(noteIndex) % pentatonicFreqs.length];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.11, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.46);
  }

  // Celebratory arpeggio when completing a challenge or publishing to social gallery
  public playSakuraFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [392.0, 440.0, 587.33, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.075;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.1, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0005, startTime + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.56);
    });
  }
}

export const soundFX = new SoundController();
