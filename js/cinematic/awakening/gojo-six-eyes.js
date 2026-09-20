/**
 * MULTIVERSE HUNTER — SATORU GOJO "SIX EYES" AWAKENING ARTWORK & RENDERER (V3.1)
 * Modular character artwork presentation decoupled from generic cinematic engine.
 *
 * Provides:
 * - render(): Generates the DOM structure for Gojo Six Eyes, blindfold unraveling & domain rings.
 * - animate(timeline, state): Hooks up the GSAP sequence for cosmic eye reveal.
 */

class GojoSixEyesRenderer {
    constructor() {
        this.id = 'gojo-six-eyes';
        this.name = 'Satoru Gojo — Six Eyes (Limitless)';
        this.universe = 'Jujutsu Kaisen';
    }

    render() {
        return `
            <div class="awakening-cinematic-stage gojo-stage">
                <div class="awakening-stars-bg"></div>
                <div class="awakening-kanji-watermark">六眼・領域展開</div>
                <div class="gojo-domain-rings"></div>
                
                <!-- Blindfold Unraveling -->
                <div class="blindfold-wrap">
                    <div class="blindfold-ribbon left-ribbon"></div>
                    <div class="blindfold-ribbon right-ribbon"></div>
                </div>

                <!-- Gojo Six Eyes Opening Container -->
                <div class="awakening-eye-container gojo-eye-frame">
                    <div class="eye-lid top-lid"></div>
                    <div class="eye-iris gojo-six-eyes">
                        <div class="six-eyes-outer-cosmos"></div>
                        <div class="six-eyes-nebula"></div>
                        <div class="six-eyes-fractal-ring"></div>
                        <div class="six-eyes-fractal-ring-reverse"></div>
                        <div class="eye-pupil gojo-pupil">
                            <div class="pupil-starlight-core"></div>
                        </div>
                        <div class="six-eyes-rays"></div>
                        <div class="eye-lightning-sparkles"></div>
                    </div>
                    <div class="eye-lid bottom-lid"></div>
                </div>

                <!-- High-Impact Cinematic Copy -->
                <div class="awakening-text-wrap">
                    <div class="awakening-sub-tag">⚡ SYSTEM 3.0 // LIMITLESS AWAKENING PROTOCOL</div>
                    <h1 class="awakening-main-title">THROUGHOUT HEAVEN AND EARTH...</h1>
                    <h2 class="awakening-sub-title">YOU ALONE ARE THE MAIN CHARACTER.</h2>
                    <p class="awakening-desc">
                        Your physical body has been synchronized with the Multiverse Ascension Engine.<br>
                        Convert real-world workouts, nutrition & focus into boundless Hunter power.
                    </p>
                    <div class="awakening-actions mt-25">
                        <button id="btn-enter-realm" class="btn-primary-holo btn-enter-infinite">⚔ ENTER THE INFINITE REALM</button>
                        <div class="awakening-skip-hint mt-8">Press ESC, click anywhere or tap Enter to proceed</div>
                    </div>
                </div>
            </div>
        `;
    }

    animate(timeline, lifecycleState) {
        if (typeof gsap === 'undefined') return;

        timeline.fromTo('.awakening-kanji-watermark', { opacity: 0, scale: 0.8 }, { opacity: 0.12, scale: 1, duration: 1.2, ease: 'power2.out' })
          // Blindfold ribbons slide apart
          .to('.left-ribbon', { x: '-120%', opacity: 0, duration: 1.0, ease: 'power3.inOut' }, 0.2)
          .to('.right-ribbon', { x: '120%', opacity: 0, duration: 1.0, ease: 'power3.inOut' }, 0.2)
          // Eye lids open smoothly
          .to('.top-lid', { y: '-100%', duration: 1.4, ease: 'power3.inOut' }, 0.3)
          .to('.bottom-lid', { y: '100%', duration: 1.4, ease: 'power3.inOut' }, 0.3)
          // Six Eyes radiance burst
          .fromTo('.gojo-six-eyes', { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(2)' }, 0.4)
          .fromTo('.six-eyes-rays', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.3, duration: 0.8, yoyo: true, repeat: 1 }, 0.8)
          // Narrative reveal
          .fromTo('.awakening-sub-tag', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, 1.0)
          .fromTo('.awakening-main-title', { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' }, 1.2)
          .fromTo('.awakening-sub-title', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, 1.5)
          .fromTo('.awakening-desc', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 1.7)
          .fromTo('.awakening-actions', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, 1.9);
    }
}

// Global Singleton
if (typeof window !== 'undefined') {
    window.GojoSixEyesRenderer = GojoSixEyesRenderer;
}
