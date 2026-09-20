/**
 * MULTIVERSE HUNTER — SHADOW MONARCH / HUNTER AWAKENING ARTWORK (V3.1)
 * Alternative modular awakening variant (Sung Jin-Woo / Monarch Sovereign).
 */

class MonarchAwakeningRenderer {
    constructor() {
        this.id = 'monarch-awakening';
        this.name = 'Sung Jin-Woo — Shadow Monarch';
        this.universe = 'Solo Leveling';
    }

    render() {
        return `
            <div class="awakening-cinematic-stage monarch-stage">
                <div class="awakening-stars-bg"></div>
                <div class="awakening-kanji-watermark">起きろ・影の君主</div>
                
                <!-- Monarch Silhouette Aura Container -->
                <div class="hunter-silhouette-aura" style="width:260px; height:260px; margin-bottom:20px;">
                    <div class="silhouette-core" style="background: radial-gradient(circle, #8b5cf6 0%, #3b0764 70%, transparent 100%);"></div>
                    <div class="silhouette-sparks"></div>
                </div>

                <!-- High-Impact Cinematic Copy -->
                <div class="awakening-text-wrap">
                    <div class="awakening-sub-tag">⚡ SYSTEM 3.0 // SHADOW SOVEREIGN AWAKENING</div>
                    <h1 class="awakening-main-title">ARISE, HUNTER.</h1>
                    <h2 class="awakening-sub-title">THE SYSTEM HAS CHOSEN YOU.</h2>
                    <p class="awakening-desc">
                        Every rep, every gram of protein, every minute of focus builds your unstoppable shadow army.
                    </p>
                    <div class="awakening-actions mt-25">
                        <button id="btn-enter-realm" class="btn-primary-holo btn-enter-infinite">⚔ ENTER THE SYSTEM</button>
                        <div class="awakening-skip-hint mt-8">Press ESC, click anywhere or tap Enter to proceed</div>
                    </div>
                </div>
            </div>
        `;
    }

    animate(timeline, lifecycleState) {
        if (typeof gsap === 'undefined') return;

        timeline.fromTo('.awakening-kanji-watermark', { opacity: 0, scale: 0.8 }, { opacity: 0.15, scale: 1, duration: 1.2, ease: 'power2.out' })
          .fromTo('.hunter-silhouette-aura', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0, ease: 'back.out(1.5)' }, 0.2)
          .fromTo('.awakening-sub-tag', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, 0.6)
          .fromTo('.awakening-main-title', { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' }, 0.8)
          .fromTo('.awakening-sub-title', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, 1.1)
          .fromTo('.awakening-desc', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 1.3)
          .fromTo('.awakening-actions', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, 1.5);
    }
}

// Global Singleton
if (typeof window !== 'undefined') {
    window.MonarchAwakeningRenderer = MonarchAwakeningRenderer;
}
