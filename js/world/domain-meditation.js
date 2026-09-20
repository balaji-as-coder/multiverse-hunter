/**
 * MULTIVERSE HUNTER — DOMAIN EXPANSION MEDITATION & COGNITIVE VOID (V3.1)
 * Interactive anime meditation featuring:
 * - Gojo's Infinite Void atmosphere
 * - Real-time animated Inhale / Hold / Exhale breathing orb
 * - Ambient spatial frequency audio generator
 * - Post-session cognitive score & state rewards
 */

class DomainMeditationEngine {
    constructor() {
        this.modalEl = null;
        this.isRunning = false;
        this.totalSeconds = 600; // 10 minutes default
        this.remainingSeconds = 600;
        this.timerId = null;
        this.breathPhase = 'INHALE'; // INHALE | HOLD | EXHALE | STILL
        this.breathTimerId = null;
        this.audioContext = null;
        this.droneOsc = null;
        this.init();
    }

    init() {
        this.createMeditationModal();
    }

    createMeditationModal() {
        let el = document.getElementById('modal-domain-meditation');
        if (!el) {
            el = document.createElement('div');
            el.id = 'modal-domain-meditation';
            el.className = 'domain-meditation-backdrop hidden';
            document.body.appendChild(el);
        }
        this.modalEl = el;
    }

    open(durationMins = 10) {
        this.totalSeconds = durationMins * 60;
        this.remainingSeconds = this.totalSeconds;
        this.isRunning = true;

        const el = this.modalEl;
        el.className = 'domain-meditation-backdrop active';
        el.innerHTML = `
            <div class="domain-meditation-container">
                <div class="domain-cosmic-bg"></div>
                <div class="domain-kanji-bg">無量空処・深層瞑想</div>
                
                <button id="btn-close-domain-meditation" class="btn-domain-exit" title="Exit Domain">✕ EXIT</button>

                <div class="domain-header text-center">
                    <span class="domain-badge highlight-cyan">SATORU GOJO // DOMAIN: LIMITLESS VOID</span>
                    <h2 class="domain-title">“YOU DON'T NEED MORE POWER. YOU NEED CONTROL.”</h2>
                    <p class="domain-guide-sub">Sync your lungs with the Cosmic Orb. Silence internal dialogue.</p>
                </div>

                <!-- Breathing Kinetic Orb Container -->
                <div class="breathing-stage-wrap">
                    <div class="breathing-kinetic-orb" id="breathing-orb">
                        <div class="orb-core"></div>
                        <div class="orb-ripple ripple-1"></div>
                        <div class="orb-ripple ripple-2"></div>
                    </div>
                    <div class="breathing-phase-label" id="breath-phase-text">INHALE</div>
                    <div class="breathing-countdown-bar"><div class="bcb-fill" id="breath-bar"></div></div>
                </div>

                <!-- Session Timer & Stats -->
                <div class="domain-timer-wrap text-center mt-20">
                    <div class="domain-timer-digits" id="domain-timer-digits">10:00</div>
                    <div class="domain-mind-metric mt-8">
                        <span>FOCUS CAPACITY: <strong class="highlight-cyan" id="domain-focus-score">100%</strong></span>
                        <span class="ml-15">BREATH CYCLES: <strong class="highlight-purple" id="domain-breath-cycles">0</strong></span>
                    </div>
                </div>

                <!-- Guidance Quote -->
                <div class="domain-footer-quote text-center mt-25">
                    <p class="dfq-text">“Throughout heaven and earth, your mind alone commands your vessel.”</p>
                </div>
            </div>
        `;

        this.bindEvents();
        this.startSession();
        this.startDroneAudio();
    }

    bindEvents() {
        const btnExit = this.modalEl.querySelector('#btn-close-domain-meditation');
        if (btnExit) {
            btnExit.addEventListener('click', () => this.close());
        }

        const keyHandler = (e) => {
            if (e.key === 'Escape') {
                window.removeEventListener('keydown', keyHandler);
                this.close();
            }
        };
        window.addEventListener('keydown', keyHandler);
    }

    startSession() {
        this.cycles = 0;
        this.startBreathingLoop();

        this.timerId = setInterval(() => {
            this.remainingSeconds--;
            this.updateTimerDisplay();

            if (this.remainingSeconds <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const digits = document.getElementById('domain-timer-digits');
        if (!digits) return;
        const mins = Math.floor(this.remainingSeconds / 60);
        const secs = this.remainingSeconds % 60;
        digits.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    startBreathingLoop() {
        const phases = [
            { name: 'INHALE', duration: 4000, orbClass: 'orb-inhale' },
            { name: 'HOLD', duration: 4000, orbClass: 'orb-hold' },
            { name: 'EXHALE', duration: 4000, orbClass: 'orb-exhale' },
            { name: 'STILLNESS', duration: 2000, orbClass: 'orb-still' }
        ];

        let phaseIndex = 0;

        const runNextPhase = () => {
            if (!this.isRunning) return;
            const current = phases[phaseIndex];
            this.breathPhase = current.name;

            const orb = document.getElementById('breathing-orb');
            const phaseText = document.getElementById('breath-phase-text');
            const cycleText = document.getElementById('domain-breath-cycles');

            if (phaseText) phaseText.innerText = current.name;
            if (orb) {
                orb.className = `breathing-kinetic-orb ${current.orbClass}`;
            }

            if (current.name === 'INHALE') {
                this.cycles++;
                if (cycleText) cycleText.innerText = this.cycles;
            }

            phaseIndex = (phaseIndex + 1) % phases.length;
            this.breathTimerId = setTimeout(runNextPhase, current.duration);
        };

        runNextPhase();
    }

    startDroneAudio() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            this.audioContext = new AudioContext();

            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(108, this.audioContext.currentTime); // 108Hz alpha resonance
            gain.gain.setValueAtTime(0.001, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.04, this.audioContext.currentTime + 3);

            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start();
            this.droneOsc = osc;
        } catch (e) {}
    }

    stopDroneAudio() {
        try {
            if (this.droneOsc) {
                this.droneOsc.stop();
                this.droneOsc.disconnect();
                this.droneOsc = null;
            }
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
        } catch (e) {}
    }

    completeSession() {
        this.cleanup();
        const el = this.modalEl;
        el.className = 'domain-meditation-backdrop active';

        const rewardMindXp = 90;
        const rewardRecXp = 60;
        const rewardGold = 150;

        // Route through central audited progression engine
        window.systemState.gainTrackXp('mindXp', rewardMindXp, 'Completed Gojo Domain Meditation');
        window.systemState.gainTrackXp('recoveryXp', rewardRecXp, 'Parasympathetic Nervous System Recovery');
        window.systemState.data.player.gold += rewardGold;
        window.systemState.save();

        if (window.systemAudio) window.systemAudio.playVictory();
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        }

        el.innerHTML = `
            <div class="domain-meditation-container text-center">
                <div class="domain-kanji-bg">領域展開・完了</div>
                <div class="domain-badge highlight-green">DOMAIN EXPANSION CONCLUDED</div>
                <h1 class="domain-title mt-15">“YOUR CONTROL HAS IMPROVED.”</h1>
                <p class="font-14 text-muted mt-10">
                    Satoru Gojo nods in acknowledgement. Your cognitive bandwidth and focus are restored.
                </p>
                <div class="domain-rewards-grid mt-20">
                    <div class="csm-pill highlight-purple">🧠 +${rewardMindXp} MIND XP</div>
                    <div class="csm-pill highlight-green">❤️ +${rewardRecXp} RECOVERY XP</div>
                    <div class="csm-pill highlight-gold">🪙 +${rewardGold} GOLD</div>
                    <div class="csm-pill highlight-cyan">🎯 FOCUS +5</div>
                </div>
                <button id="btn-finish-domain-meditation" class="btn-primary-holo mt-25">
                    ⚔ RETURN TO MULTIVERSE WORLD
                </button>
            </div>
        `;

        const btnFinish = el.querySelector('#btn-finish-domain-meditation');
        if (btnFinish) {
            btnFinish.addEventListener('click', () => this.close());
        }

        if (window.app) window.app.syncUI();
    }

    cleanup() {
        this.isRunning = false;
        clearInterval(this.timerId);
        clearTimeout(this.breathTimerId);
        this.stopDroneAudio();
    }

    close() {
        this.cleanup();
        this.modalEl.className = 'domain-meditation-backdrop hidden';
        this.modalEl.innerHTML = '';
        if (window.app) window.app.syncUI();
    }
}

// Global Singleton
if (typeof window !== 'undefined') {
    window.domainMeditation = new DomainMeditationEngine();
}
