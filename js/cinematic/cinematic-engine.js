/**
 * MULTIVERSE HUNTER — MASTER CINEMATIC MOMENTS ENGINE (V3.1)
 * Decouples all anime cinematics, cutscenes, domain expansions, awakening sequences,
 * and celebratory VFX from underlying health, progression, and state logic.
 *
 * All cutscenes are managed through `window.CinematicState` with clean lifecycle,
 * immediate abort/skip capabilities, zero state mutation, and modular character renderers.
 */

class CinematicEngine {
    constructor() {
        this.overlayEl = null;
        this.awakeningEngine = null;
        this.init();
    }

    init() {
        this.createCinematicOverlayContainer();
        if (typeof window.AwakeningEngine !== 'undefined') {
            this.awakeningEngine = new window.AwakeningEngine();
        }
        this.checkInitialAwakening();
    }

    createCinematicOverlayContainer() {
        let el = document.getElementById('cinematic-root-overlay');
        if (!el) {
            el = document.createElement('div');
            el.id = 'cinematic-root-overlay';
            el.className = 'cinematic-overlay-backdrop hidden';
            document.body.appendChild(el);
        }
        this.overlayEl = el;
    }

    /**
     * Initial Anime Eye Opening Awakening Sequence on Page Load / Refresh
     */
    checkInitialAwakening() {
        const runSplash = () => {
            setTimeout(() => {
                this.awakening({ character: 'gojo', variant: 'six-eyes' });
            }, 100);
        };

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            runSplash();
        } else {
            window.addEventListener('DOMContentLoaded', runSplash);
        }
    }

    /**
     * Purely cinematic awakening cutscene. Never mutates XP, level, workouts, or state.
     * @param {Object} [options]
     * @param {string} [options.character='gojo']
     * @param {string} [options.variant='six-eyes']
     * @param {Function} [options.onComplete]
     */
    awakening({ character = 'gojo', variant = 'six-eyes', onComplete } = {}) {
        if (!this.awakeningEngine) {
            this.awakeningEngine = new window.AwakeningEngine();
        }
        this.awakeningEngine.play({
            character,
            variant,
            container: this.overlayEl,
            onComplete
        });
    }

    /**
     * Backward-compatible alias for awakening
     */
    playAwakeningSplash(onComplete) {
        this.awakening({ character: 'gojo', variant: 'six-eyes', onComplete });
    }

    /**
     * Skip active cinematic cutscene immediately
     */
    skip() {
        if (window.CinematicState) {
            window.CinematicState.skip();
        }
    }

    /**
     * Cinematic Level Up Moment
     */
    levelUp({ newLevel = 2, bodyLevel = 1, lifeLevel = 1, rank = 'E', onComplete = null } = {}) {
        const el = this.overlayEl;
        const state = window.CinematicState;

        state.start('LEVEL_UP', {
            cleanup: () => {
                el.className = 'cinematic-overlay-backdrop hidden';
                el.innerHTML = '';
            },
            onComplete
        });

        el.className = 'cinematic-overlay-backdrop active';
        el.innerHTML = `
            <div class="cinematic-modal-card levelup-stage">
                <div class="cinematic-bg-glow"></div>
                <div class="hunter-silhouette-aura">
                    <div class="silhouette-core"></div>
                    <div class="silhouette-sparks"></div>
                </div>
                <div class="cinematic-badge">SYSTEM NOTIFICATION</div>
                <h1 class="cinematic-huge-text">LEVEL UP</h1>
                <div class="cinematic-level-counter">
                    <span class="clc-label">HUNTER LEVEL</span>
                    <strong class="clc-val highlight-violet">${newLevel}</strong>
                </div>
                <div class="cinematic-sub-metrics mt-15">
                    <div class="csm-pill">💪 BODY LVL: <strong>${bodyLevel}</strong></div>
                    <div class="csm-pill">🧠 LIFE LVL: <strong>${lifeLevel}</strong></div>
                    <div class="csm-pill">🏅 RANK: <strong>${rank}</strong></div>
                </div>
                <p class="cinematic-desc mt-15">Your physical vessel has expanded. All biological limits elevated.</p>
                <div class="cinematic-actions mt-20">
                    <button class="btn-cinematic-primary btn-close-cinematic">CONFIRM ASCENSION</button>
                </div>
            </div>
        `;

        if (window.systemAudio) window.systemAudio.playLevelUp();
        if (window.particleEngine) window.particleEngine.setIntensity('LEVEL_UP');

        // Wire listener for close button & skip keys
        const btnClose = el.querySelector('.btn-close-cinematic');
        if (btnClose) state.registerListener(btnClose, 'click', () => state.complete());
        state.registerListener(el, 'click', (e) => {
            if (e.target === el) state.complete();
        });
        state.registerListener(window, 'keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Enter') state.complete();
        });

        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            state.registerGsap(tl);
            tl.fromTo('.levelup-stage', { scale: 0.7, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' })
              .fromTo('.cinematic-huge-text', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' }, 0.15)
              .fromTo('.clc-val', { scale: 2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'bounce.out' }, 0.3);
        }
    }

    /**
     * Cinematic Rank Up Moment (e.g. E -> D -> C -> B -> A -> S)
     */
    rankUp({ oldRank = 'E', newRank = 'D', title = 'Novice Hunter', onComplete = null } = {}) {
        const el = this.overlayEl;
        const state = window.CinematicState;

        state.start('RANK_UP', {
            cleanup: () => {
                el.className = 'cinematic-overlay-backdrop hidden';
                el.innerHTML = '';
            },
            onComplete
        });

        el.className = 'cinematic-overlay-backdrop active';
        el.innerHTML = `
            <div class="cinematic-modal-card rankup-stage">
                <div class="cinematic-gold-halo"></div>
                <div class="cinematic-badge gold-badge">RANK ADVANCEMENT</div>
                <h1 class="cinematic-huge-text rank-title">HUNTER PROMOTION</h1>
                <div class="rank-transition-row mt-15">
                    <span class="old-rank-pill">${oldRank}</span>
                    <span class="rank-arrow">➔</span>
                    <span class="new-rank-pill gold-glow">${newRank}</span>
                </div>
                <div class="new-title-display mt-12">${title.toUpperCase()}</div>
                <p class="cinematic-desc mt-15">Multiverse Gate Authorization Upgraded. Higher tier Gate Bosses are now accessible.</p>
                <div class="cinematic-actions mt-20">
                    <button class="btn-cinematic-primary btn-close-cinematic">CLAIM NEW RANK</button>
                </div>
            </div>
        `;

        if (window.systemAudio) window.systemAudio.playRankUp();
        if (window.particleEngine) window.particleEngine.setIntensity('RANK_UP');

        const btnClose = el.querySelector('.btn-close-cinematic');
        if (btnClose) state.registerListener(btnClose, 'click', () => state.complete());
        state.registerListener(el, 'click', (e) => {
            if (e.target === el) state.complete();
        });
        state.registerListener(window, 'keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Enter') state.complete();
        });

        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            state.registerGsap(tl);
            tl.fromTo('.rankup-stage', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' })
              .fromTo('.new-rank-pill', { scale: 0.2, rotation: -25, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 0.25);
        }
    }

    /**
     * Cinematic Skill / Domain Expansion Unlock
     */
    skillUnlock({ skillName = 'UNLIMITED VOID', universe = 'Jujutsu Kaisen', desc = 'Cursed Energy flows into absolute infinite comprehension.', onComplete = null } = {}) {
        const el = this.overlayEl;
        const state = window.CinematicState;

        state.start('SKILL_UNLOCK', {
            cleanup: () => {
                el.className = 'cinematic-overlay-backdrop hidden';
                el.innerHTML = '';
            },
            onComplete
        });

        el.className = 'cinematic-overlay-backdrop active';
        el.innerHTML = `
            <div class="cinematic-modal-card domain-expansion-stage">
                <div class="domain-rift-vfx"></div>
                <div class="cinematic-badge">DOMAIN EXPANSION UNLOCKED</div>
                <h1 class="cinematic-huge-text skill-heading">${skillName}</h1>
                <div class="skill-universe-tag font-12 mt-4 text-muted">${universe.toUpperCase()} REALM</div>
                <p class="cinematic-desc mt-15">${desc}</p>
                <div class="cinematic-actions mt-20">
                    <button class="btn-cinematic-primary btn-close-cinematic">INTEGRATE TECHNIQUE</button>
                </div>
            </div>
        `;

        if (window.systemAudio) window.systemAudio.playDomainExpansion();
        if (window.particleEngine) window.particleEngine.setIntensity('DOMAIN');

        const btnClose = el.querySelector('.btn-close-cinematic');
        if (btnClose) state.registerListener(btnClose, 'click', () => state.complete());
        state.registerListener(el, 'click', (e) => {
            if (e.target === el) state.complete();
        });
        state.registerListener(window, 'keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Enter') state.complete();
        });

        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            state.registerGsap(tl);
            tl.fromTo('.domain-expansion-stage', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'power2.out' })
              .fromTo('.domain-rift-vfx', { opacity: 0, scale: 0.3 }, { opacity: 0.6, scale: 1.2, duration: 0.8 }, 0.1);
        }
    }

    /**
     * Cinematic Gate Rift Opening
     */
    gateOpen({ universe = 'Solo Leveling', gateRank = 'A-Rank', gateName = 'Red Gate Dungeon', onComplete = null } = {}) {
        const el = this.overlayEl;
        const state = window.CinematicState;

        state.start('GATE_OPEN', {
            cleanup: () => {
                el.className = 'cinematic-overlay-backdrop hidden';
                el.innerHTML = '';
            },
            onComplete
        });

        el.className = 'cinematic-overlay-backdrop active';
        el.innerHTML = `
            <div class="cinematic-modal-card gate-opening-stage">
                <div class="gate-dimensional-rift"></div>
                <div class="cinematic-badge crimson-badge">DIMENSIONAL RIFT DETECTED</div>
                <h1 class="cinematic-huge-text gate-title">${gateName.toUpperCase()}</h1>
                <div class="gate-meta-row mt-10">
                    <span class="csm-pill">🌌 UNIVERSE: <strong>${universe}</strong></span>
                    <span class="csm-pill">⚠ DANGER: <strong>${gateRank}</strong></span>
                </div>
                <p class="cinematic-desc mt-15">The boundary between dimensions has fractured. Prepare for high-intensity trials.</p>
                <div class="cinematic-actions mt-20">
                    <button class="btn-cinematic-danger btn-close-cinematic">ENTER DUNGEON GATE</button>
                </div>
            </div>
        `;

        if (window.systemAudio) window.systemAudio.playGateOpen();
        if (window.particleEngine) window.particleEngine.setIntensity('BOSS');

        const btnClose = el.querySelector('.btn-close-cinematic');
        if (btnClose) state.registerListener(btnClose, 'click', () => state.complete());
        state.registerListener(el, 'click', (e) => {
            if (e.target === el) state.complete();
        });
        state.registerListener(window, 'keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Enter') state.complete();
        });
    }

    /**
     * Cinematic Boss Raid Intro
     */
    bossIntro({ name = 'Ryomen Sukuna', rank = 'Special Grade', hp = 2500, universe = 'Jujutsu Kaisen', onComplete = null } = {}) {
        const el = this.overlayEl;
        const state = window.CinematicState;

        state.start('BOSS_INTRO', {
            cleanup: () => {
                el.className = 'cinematic-overlay-backdrop hidden';
                el.innerHTML = '';
            },
            onComplete
        });

        el.className = 'cinematic-overlay-backdrop active';
        el.innerHTML = `
            <div class="cinematic-modal-card boss-intro-stage">
                <div class="boss-aura-red"></div>
                <div class="cinematic-badge crimson-badge">SPECIAL GRADE BOSS RAID</div>
                <h1 class="cinematic-huge-text boss-title">${name.toUpperCase()}</h1>
                <div class="boss-stats-row mt-12">
                    <span class="csm-pill">👹 ${rank}</span>
                    <span class="csm-pill">🛡️ ${(hp || 2500).toLocaleString()} HP</span>
                    <span class="csm-pill">🌌 ${universe}</span>
                </div>
                <p class="cinematic-desc mt-15">High-intensity focus raid initiated. Work with uncompromising precision to inflict damage.</p>
                <div class="cinematic-actions mt-20">
                    <button class="btn-cinematic-danger btn-close-cinematic">ENGAGE BOSS</button>
                </div>
            </div>
        `;

        if (window.systemAudio) window.systemAudio.playBossEncounter();
        if (window.particleEngine) window.particleEngine.setIntensity('BOSS');

        const btnClose = el.querySelector('.btn-close-cinematic');
        if (btnClose) state.registerListener(btnClose, 'click', () => state.complete());
        state.registerListener(el, 'click', (e) => {
            if (e.target === el) state.complete();
        });
        state.registerListener(window, 'keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Enter') state.complete();
        });
    }

    /**
     * Cinematic Boss Defeat Victory
     */
    bossDefeat({ name = 'Ryomen Sukuna', rewardXp = 500, rewardGold = 150, onComplete = null } = {}) {
        const el = this.overlayEl;
        const state = window.CinematicState;

        state.start('BOSS_DEFEAT', {
            cleanup: () => {
                el.className = 'cinematic-overlay-backdrop hidden';
                el.innerHTML = '';
            },
            onComplete
        });

        el.className = 'cinematic-overlay-backdrop active';
        el.innerHTML = `
            <div class="cinematic-modal-card victory-stage">
                <div class="victory-light-beams"></div>
                <div class="cinematic-badge gold-badge">STAGE CLEARED</div>
                <h1 class="cinematic-huge-text victory-title">${name.toUpperCase()} DEFEATED</h1>
                <div class="victory-rewards-card mt-15">
                    <div class="vrc-item highlight-green">+${rewardXp} Mind XP</div>
                    <div class="vrc-item highlight-gold">+${rewardGold} Gold</div>
                    <div class="vrc-item highlight-cyan">Gate Core Extracted</div>
                </div>
                <p class="cinematic-desc mt-15">The Multiverse dimensional rift has stabilized. Your focus capacity has ascended.</p>
                <div class="cinematic-actions mt-20">
                    <button class="btn-cinematic-primary btn-close-cinematic">COLLECT REWARDS</button>
                </div>
            </div>
        `;

        if (window.systemAudio) window.systemAudio.playVictory();
        if (window.particleEngine) window.particleEngine.setIntensity('NORMAL');

        const btnClose = el.querySelector('.btn-close-cinematic');
        if (btnClose) state.registerListener(btnClose, 'click', () => state.complete());
        state.registerListener(el, 'click', (e) => {
            if (e.target === el) state.complete();
        });
        state.registerListener(window, 'keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Enter') state.complete();
        });
    }

    /**
     * Set particle intensity directly
     */
    setParticleIntensity(mode) {
        if (window.particleEngine) {
            window.particleEngine.setIntensity(mode);
        }
    }
}

// Global Singleton Instance
if (typeof window !== 'undefined') {
    window.cinematicEngine = new CinematicEngine();
}
