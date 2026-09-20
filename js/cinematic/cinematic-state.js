/**
 * MULTIVERSE HUNTER — CINEMATIC LIFECYCLE & STATE MANAGER (V3.1)
 * Centralizes lifecycle management, abort controllers, GSAP cleanup,
 * Web Audio node disposal, and RAF / timer clearing for all cinematic cutscenes.
 */

class CinematicLifecycleManager {
    constructor() {
        this.active = false;
        this.type = null;
        this.abortController = null;
        this.audioNodes = [];
        this.animationIds = [];
        this.gsapTimelines = [];
        this.timerIds = [];
        this.listeners = [];
        this.cleanupFn = null;
        this.onCompleteCallback = null;
    }

    /**
     * Start a new cinematic lifecycle. Cancels any currently active cinematic first.
     */
    start(type, { cleanup = null, onComplete = null } = {}) {
        if (this.active) {
            this.skip();
        }

        this.active = true;
        this.type = type;
        this.cleanupFn = cleanup;
        this.onCompleteCallback = onComplete;
        this.abortController = new AbortController();
        this.audioNodes = [];
        this.animationIds = [];
        this.gsapTimelines = [];
        this.timerIds = [];
        this.listeners = [];

        return this.abortController.signal;
    }

    /**
     * Register a GSAP tween or timeline for tracked cleanup
     */
    registerGsap(tweenOrTimeline) {
        if (tweenOrTimeline) {
            this.gsapTimelines.push(tweenOrTimeline);
        }
        return tweenOrTimeline;
    }

    /**
     * Register a setTimeout / setInterval timer ID
     */
    registerTimer(timerId) {
        if (timerId) {
            this.timerIds.push(timerId);
        }
        return timerId;
    }

    /**
     * Register a requestAnimationFrame ID
     */
    registerRaf(rafId) {
        if (rafId) {
            this.animationIds.push(rafId);
        }
        return rafId;
    }

    /**
     * Register a Web Audio node for instant disconnection
     */
    registerAudioNode(node) {
        if (node) {
            this.audioNodes.push(node);
        }
        return node;
    }

    /**
     * Register a DOM event listener with auto-detachment
     */
    registerListener(target, event, handler, options = {}) {
        if (!target) return;
        target.addEventListener(event, handler, options);
        this.listeners.push({ target, event, handler, options });
    }

    /**
     * Immediately skip/cancel the active cinematic, killing all running animations,
     * timers, audio instances, and detaching event listeners without state leakage.
     */
    skip() {
        if (!this.active) return;
        const cb = this.onCompleteCallback;
        this.cleanup();
        if (cb) {
            try { cb(); } catch (e) { console.error('Cinematic onComplete callback error:', e); }
        }
    }

    /**
     * Complete the cinematic naturally
     */
    complete() {
        if (!this.active) return;
        const cb = this.onCompleteCallback;
        this.cleanup();
        if (cb) {
            try { cb(); } catch (e) { console.error('Cinematic onComplete callback error:', e); }
        }
    }

    /**
     * Full teardown of all active resources
     */
    cleanup() {
        // Abort signal
        if (this.abortController) {
            try { this.abortController.abort(); } catch (e) {}
            this.abortController = null;
        }

        // Kill GSAP animations
        this.gsapTimelines.forEach(tl => {
            try {
                if (typeof tl.kill === 'function') tl.kill();
            } catch (e) {}
        });
        this.gsapTimelines = [];

        // Clear timers
        this.timerIds.forEach(id => {
            clearTimeout(id);
            clearInterval(id);
        });
        this.timerIds = [];

        // Cancel RAFs
        this.animationIds.forEach(id => {
            cancelAnimationFrame(id);
        });
        this.animationIds = [];

        // Disconnect and stop audio nodes
        this.audioNodes.forEach(node => {
            try {
                if (typeof node.stop === 'function') node.stop();
                if (typeof node.disconnect === 'function') node.disconnect();
            } catch (e) {}
        });
        this.audioNodes = [];

        // Detach listeners
        this.listeners.forEach(({ target, event, handler, options }) => {
            try {
                target.removeEventListener(event, handler, options);
            } catch (e) {}
        });
        this.listeners = [];

        // Run custom cleanup callback if registered
        if (typeof this.cleanupFn === 'function') {
            try { this.cleanupFn(); } catch (e) { console.error('Custom cleanup failed:', e); }
            this.cleanupFn = null;
        }

        // Reset particle intensity
        if (window.particleEngine) {
            window.particleEngine.setIntensity('NORMAL');
        }

        this.active = false;
        this.type = null;
        this.onCompleteCallback = null;
    }
}

// Global Singleton Instance
if (typeof window !== 'undefined') {
    window.CinematicState = new CinematicLifecycleManager();
}
