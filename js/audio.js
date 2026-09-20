/**
 * System Procedural Audio Engine (Web Audio API)
 * Generates authentic anime sci-fi sound effects in real-time with zero external files.
 */
class SystemAudio {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.isUnlocked = false;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.isUnlocked = true;
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    /* System Notification [Ding / High-Tech Alert] */
    playNotification() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now); // A5
        osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.12);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1320, now + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(2640, now + 0.18);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now + 0.05);
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);
    }

    /* UI Click / Button Tap */
    playClick() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
    }

    /* Stat Increase / Rep Count Tick */
    playStatAdd() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.08); // C6

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    /* Level Up Grand Fanfare */
    playLevelUp() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const chords = [
            { freq: 440, time: 0 },       // A4
            { freq: 554.37, time: 0.1 },  // C#5
            { freq: 659.25, time: 0.2 },  // E5
            { freq: 880, time: 0.3 },     // A5
            { freq: 1108.73, time: 0.45 },// C#6
            { freq: 1318.51, time: 0.6 }  // E6
        ];

        chords.forEach(c => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(c.freq, now + c.time);

            // Filter for warm brass/synth sound
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2500, now + c.time);

            gain.gain.setValueAtTime(0.18, now + c.time);
            gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + 0.7);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + c.time);
            osc.stop(now + c.time + 0.75);
        });
    }

    /* ARISE (일어나라) - Dark Monarch Bass Resonance */
    playArise() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Sub bass drone
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(110, now);
        subOsc.frequency.exponentialRampToValueAtTime(45, now + 1.2);

        subGain.gain.setValueAtTime(0.4, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 2.0);

        // Mystic metallic shimmer
        const shimmer = this.ctx.createOscillator();
        const shimGain = this.ctx.createGain();
        shimmer.type = 'triangle';
        shimmer.frequency.setValueAtTime(660, now + 0.2);
        shimmer.frequency.exponentialRampToValueAtTime(1320, now + 1.0);

        shimGain.gain.setValueAtTime(0.12, now + 0.2);
        shimGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        shimmer.connect(shimGain);
        shimGain.connect(this.ctx.destination);
        shimmer.start(now + 0.2);
        shimmer.stop(now + 1.8);
    }

    /* Penalty Siren / Danger Klaxon */
    playPenaltyAlert() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        for (let i = 0; i < 2; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            const startTime = now + (i * 0.35);
            osc.frequency.setValueAtTime(400, startTime);
            osc.frequency.linearRampToValueAtTime(800, startTime + 0.15);
            osc.frequency.linearRampToValueAtTime(400, startTime + 0.3);

            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.33);
        }
    }

    /* Boss Hit Strike Impact */
    playBossHit() {
        try {
            if (this.muted) return;
            this.init();
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(55, now + 0.15);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) {
            console.warn('Audio playBossHit warn:', e);
        }
    }

    /* Gate Enter / Dimensional Warp */
    playGateEnter() {
        try {
            if (this.muted) return;
            this.init();
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.5);
        } catch (e) {
            console.warn('Audio playGateEnter warn:', e);
        }
    }

    /* Quest Complete / Reward Jingle */
    playQuestComplete() {
        try {
            if (this.muted) return;
            this.init();
            const now = this.ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const noteTime = now + (idx * 0.08);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0.15, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(noteTime);
                osc.stop(noteTime + 0.26);
            });
        } catch (e) {
            console.warn('Audio playQuestComplete warn:', e);
        }
    }

    /* Boss Enter / Special Grade Warning */
    playBossEnter() {
        this.playPenaltyAlert();
    }

    playBossEncounter() {
        this.playPenaltyAlert();
    }

    /* Victory Celebration Fanfare */
    playVictory() {
        this.playLevelUp();
    }

    /* Gojo Six Eyes Awakening / Cosmic Void Entry */
    playAwakening() {
        if (this.muted) return;
        try {
            this.init();
            const now = this.ctx.currentTime;
            
            // Deep sub-bass resonance surge
            const subOsc = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(55, now);
            subOsc.frequency.exponentialRampToValueAtTime(120, now + 0.5);
            subOsc.frequency.exponentialRampToValueAtTime(35, now + 1.8);
            subGain.gain.setValueAtTime(0.35, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
            subOsc.connect(subGain);
            subGain.connect(this.ctx.destination);
            subOsc.start(now);
            subOsc.stop(now + 2.0);

            // Crystalline Six Eyes Celestial Chime
            const chime1 = this.ctx.createOscillator();
            const chime2 = this.ctx.createOscillator();
            const chimeGain = this.ctx.createGain();
            chime1.type = 'sine';
            chime2.type = 'triangle';
            chime1.frequency.setValueAtTime(1174.66, now + 0.3); // D6
            chime1.frequency.exponentialRampToValueAtTime(2349.32, now + 1.1);
            chime2.frequency.setValueAtTime(1760, now + 0.3); // A6
            chimeGain.gain.setValueAtTime(0.2, now + 0.3);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
            chime1.connect(chimeGain);
            chime2.connect(chimeGain);
            chimeGain.connect(this.ctx.destination);
            chime1.start(now + 0.3);
            chime2.start(now + 0.3);
            chime1.stop(now + 2.2);
            chime2.stop(now + 2.2);
        } catch(e) {
            console.warn('Audio playAwakening error:', e);
        }
    }
}

window.systemAudio = new SystemAudio();
