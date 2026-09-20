/**
 * MULTIVERSE HUNTER — AWAKENING CUTSCENE ENGINE (V3.1)
 * Decouples awakening presentation logic from both the fitness system
 * and the specific anime IP artwork.
 *
 * Supports:
 * - awakening({ character: 'gojo', variant: 'six-eyes', onComplete })
 * - awakening({ character: 'jinwoo', variant: 'monarch-awakening', onComplete })
 */

class AwakeningEngine {
    constructor() {
        this.renderers = {
            'gojo': new window.GojoSixEyesRenderer(),
            'six-eyes': new window.GojoSixEyesRenderer(),
            'jinwoo': new window.MonarchAwakeningRenderer(),
            'monarch': new window.MonarchAwakeningRenderer()
        };
    }

    /**
     * Register a new character awakening renderer plugin
     */
    registerRenderer(id, rendererInstance) {
        this.renderers[id] = rendererInstance;
    }

    /**
     * Play awakening sequence
     * @param {Object} options
     * @param {string} [options.character='gojo']
     * @param {string} [options.variant='six-eyes']
     * @param {HTMLElement} options.container
     * @param {Function} [options.onComplete]
     */
    play({ character = 'gojo', variant = 'six-eyes', container, onComplete } = {}) {
        if (!container) return;

        const renderer = this.renderers[character] || this.renderers[variant] || this.renderers['gojo'];
        if (!renderer) return;

        // Start lifecycle
        const state = window.CinematicState;
        state.start('AWAKENING', {
            cleanup: () => {
                container.className = 'cinematic-overlay-backdrop hidden';
                container.innerHTML = '';
                container.style.opacity = '1';
            },
            onComplete
        });

        // Inject DOM
        container.className = 'cinematic-overlay-backdrop active splash-mode';
        container.innerHTML = renderer.render();

        // Audio & Particles
        if (window.systemAudio) window.systemAudio.playAwakening();
        if (window.particleEngine) window.particleEngine.setIntensity('LEVEL_UP');

        // Wire Up Immediate Skip Triggers
        const enterBtn = container.querySelector('#btn-enter-realm');
        if (enterBtn) {
            state.registerListener(enterBtn, 'click', (e) => {
                e.stopPropagation();
                state.skip();
            });
        }

        state.registerListener(container, 'click', () => state.skip());

        const keyHandler = (e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                state.skip();
            }
        };
        state.registerListener(window, 'keydown', keyHandler);

        // Animate Timeline
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({
                onComplete: () => {
                    const timer = setTimeout(() => {
                        state.complete();
                    }, 2800);
                    state.registerTimer(timer);
                }
            });
            state.registerGsap(tl);
            renderer.animate(tl, state);
        } else {
            const timer = setTimeout(() => state.complete(), 3500);
            state.registerTimer(timer);
        }
    }
}

if (typeof window !== 'undefined') {
    window.AwakeningEngine = AwakeningEngine;
}
